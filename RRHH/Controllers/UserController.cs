using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RRHH.Models;
using RRHH.Models.Database;
using RRHH.Models.ViewModels;
using RRHH.Services.Business;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UserController : ControllerBase
    {
        readonly MySQLDbContext _dbContext;
        readonly SecurityService _security;
        readonly EmailService _mail;

        public UserController(MySQLDbContext dbContext, SecurityService security, EmailService mailService)
        {
            _dbContext = dbContext;
            _security = security;
            _mail = mailService;
        }

        [HttpPost]
        public bool Create([FromBody] UserViewModel model)
        {
            if (model is null || !model.IsValid() || string.IsNullOrWhiteSpace(model.Clave)) return false;
            model.Trim();

            bool exists = _dbContext.Usuarios.Any(x => x.NombreUsuario.ToUpper() == model.NombreUsuario.ToUpper() || x.Correo.ToUpper() == model.Correo.ToUpper());
            if (exists) return false;

            model.Clave = _security.Hash(model.Clave.Trim());

            _dbContext.Usuarios.Add(model.ToUsuario());
            _dbContext.SaveChanges();

            return true;
        }

        [HttpPost]
        [AllowAnonymous]
        public bool CreateAspirant([FromBody] AspirantUserViewModel model)
        {
            if (model is null || !model.IsValid() || string.IsNullOrWhiteSpace(model.Clave)) 
                return false;

            model.Trim();

            bool exists = _dbContext.Usuarios.Any(x => x.NombreUsuario.ToUpper() == model.Correo.ToUpper() ||  x.Correo.ToUpper() == model.Correo.ToUpper() || x.Cedula.ToUpper() == model.Cedula.ToUpper());
            if (exists) return false;

            model.Clave = _security.Hash(model.Clave);

            var user = model.ToUser();

            _dbContext.Usuarios.Add(user);
            _dbContext.SaveChanges();

            var register = new Registro(user);
            _dbContext.Registros.Add(register);
            _dbContext.SaveChanges();

            _mail.SendConfirmationMail(user.Correo, $"{user.Nombre} {user.Apellidos}", register.Token);

            return true;
        }

        [HttpGet]
        public IEnumerable<object> GetAll(bool includeInactives = true)
        {
            var result = _dbContext.Usuarios.AsQueryable();
            if (includeInactives)
                result = result.Where(x => x.Estado == Estado.Activo || x.Estado == Estado.Inactivo);
            else
                result = result.Where(x => x.Estado == Estado.Activo);

            result = result.OrderByDescending(x => x.Estado)
                           .ThenBy(x => x.NombreUsuario);
            return result;
        }

        [HttpPut]
        public bool Update([FromBody] UserViewModel model)
        {
            if (model is null || !model.IsValid()) return false;
            model.Trim();
            
            bool exists = _dbContext.Usuarios.Any(x => (x.NombreUsuario.ToUpper() == model.NombreUsuario.ToUpper() || x.Correo.ToUpper() == model.Correo.ToUpper()) && x.UsuarioId != model.UsuarioId);
            if (exists) return false;

            var item = _dbContext.Usuarios.FirstOrDefault(x => x.UsuarioId == model.UsuarioId);
            item.NombreUsuario = model.NombreUsuario;
            item.Nombre = model.Nombre;
            item.Correo = model.Correo;
            item.Apellidos = model.Apellidos;
            item.Estado = model.Estado;
            item.Role = model.Role;
            item.Telefono = model.Telefono;
            item.Cedula = model.Cedula;

            if (model.Clave != null)
                item.Clave = _security.Hash(model.Clave.Trim());

            var asg = _dbContext.Candidatos.FirstOrDefault(x => x.Usuario.UsuarioId == model.UsuarioId);
            if (asg != null)
            {
                asg.Nombre = item.Nombre;
                asg.Apellidos = item.Apellidos;
                asg.Telefono = item.Telefono;
                asg.Usuario.Correo = item.Correo;
                asg.Cedula = item.Cedula;
                _dbContext.Update(asg);
            }

            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpDelete]
        public bool Delete(int id)
        {
            if (id <= 0) return false;
            var item = _dbContext.Usuarios.FirstOrDefault(x => x.UsuarioId == id);
            if (item is null) return false;

            item.Estado = Estado.Eliminado;
            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        }

        [AllowAnonymous]
        public bool ActivateAccount(string email, string token) 
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(token)) return false;

            var registration = _dbContext.Registros
                .Include(x=> x.Usuario)
                .FirstOrDefault(x => x.Token.ToUpper() == token.ToUpper() && x.Usuario.Correo.ToUpper() == email.ToUpper());

            if (registration is null || !registration.IsValid())
                return false;

            registration.Usuario.Estado = Estado.Activo;
            _dbContext.SaveChanges();

            _dbContext.Registros.Remove(registration);
            _dbContext.SaveChanges();

            return true;
        }

        [AllowAnonymous]
        public bool ReSendConfirmationEmail([FromBody] ResendEmailViewModel model) 
        {
            if (!model.IsValid()) return false;
            model.Trim();
            model.Correo = model.Correo.ToUpper();

            var oldregistries = _dbContext.Registros.Where(x => x.Usuario.Correo.ToUpper() == model.Correo);

            if (oldregistries != null) 
            {
                _dbContext.RemoveRange(oldregistries);
                _dbContext.SaveChanges();
            }

            var user = _dbContext.Usuarios.FirstOrDefault(x => x.Correo.ToUpper() == model.Correo);
            if (user is null) return false;

            var register = new Registro(user);
            _dbContext.Registros.Add(register);
            _dbContext.SaveChanges();

            _mail.SendConfirmationMail(user.Correo, $"{user.Nombre} {user.Apellidos}", register.Token);

            return true;
        }

        [HttpPost]
        [AllowAnonymous]
        public bool RequestRestorePassword([FromBody] ResendEmailViewModel model)
        {
            if (!model.IsValid()) return false;
            model.Trim();
            model.Correo = model.Correo?.ToUpper();

            var user = _dbContext.Usuarios.FirstOrDefault(x => x.Correo.ToUpper() == model.Correo && x.Estado == Estado.Activo);
            if (user is null) return false;

            var oldRegistries = _dbContext.Registros.Where(x => x.Usuario.UsuarioId == user.UsuarioId);
            if (oldRegistries.Count() > 0) 
            {
                _dbContext.RemoveRange(oldRegistries);
                _dbContext.SaveChanges();
            }

            var register = new Registro(user);
            _dbContext.Registros.Add(register);
            _dbContext.SaveChanges();

            _mail.SendRequestRestorePassword(user.Correo, $"{user.Nombre} {user.Apellidos}", register.Token);

            return true;
        }

        [HttpPost]
        [AllowAnonymous]
        public bool RestorePassword([FromBody] RestorePasswordViewModel model)
        {
            if (!model.IsValid()) return false;
            model.Trim();

            var registration = _dbContext.Registros
                .Include(x=> x.Usuario)
                .FirstOrDefault(x => x.Token.ToUpper() == model.Token.ToUpper() && x.Usuario.Correo.ToUpper() == model.Correo.ToUpper() && x.Usuario.Estado == Estado.Activo);

            if (registration is null || !registration.IsValid())
                return false;

            var user = _dbContext.Usuarios.FirstOrDefault(x => x.UsuarioId == registration.Usuario.UsuarioId && x.Estado == Estado.Activo);
            user.Clave = _security.Hash(model.Clave);
            _dbContext.Registros.Remove(registration);

            _dbContext.SaveChanges();

            return true;
        }
    }
}

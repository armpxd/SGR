using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RRHH.Models.Database;
using RRHH.Models.ViewModels;
using RRHH.Services.Business;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
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
        public bool Create([FromBody] Usuario model)
        {
            if (model is null || !model.IsValid() || string.IsNullOrWhiteSpace(model.Clave)) return false;
            model.Trim();

            bool exists = _dbContext.Usuarios.Any(x => x.NombreUsuario.ToUpper() == model.NombreUsuario.ToUpper() || x.Correo.ToUpper() == model.Correo.ToUpper());
            if (exists) return false;

            model.Clave = _security.Hash(model.Clave.Trim());

            _dbContext.Usuarios.Add(model);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpPost]
        [AllowAnonymous]
        public bool CreateAspirant([FromBody] Aspirant model)
        {
            if (model is null || !model.IsValid() || string.IsNullOrWhiteSpace(model.Clave)) 
                return false;

            model.Trim();

            bool exists = _dbContext.Usuarios.Any(x => x.Correo.ToUpper() == model.Correo.ToUpper() || x.Cedula.ToUpper() == model.Cedula.ToUpper());
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
        public IEnumerable<object> GetAll()
        {
            var result = _dbContext.Usuarios.OrderByDescending(x => x.Estado).ThenBy(x => x.NombreUsuario).Select(x=> new  
            {
                x.UsuarioId,
                x.NombreUsuario,
                x.Nombre,
                x.Apellidos,
                x.Correo,
                x.Estado,
                x.Role
            });
            return result;
        }

        [HttpPut]
        public bool Update([FromBody] Usuario model)
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

            if (model.Clave != null)
                item.Clave = _security.Hash(model.Clave.Trim());

            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpDelete]
        public bool Delete(int id)
        {
            if (id <= 0) return false;
            var lang = _dbContext.Usuarios.FirstOrDefault(x => x.UsuarioId == id);
            if (lang is null) return false;

            _dbContext.Remove(lang);
            _dbContext.SaveChanges();

            return true;
        }

        public bool ActivateAccount(string email, string token) 
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(token)) return false;

            var registration = _dbContext.Registros
                .Include(x=> x.Usuario)
                .FirstOrDefault(x => x.Token.ToUpper() == token.ToUpper() && x.Usuario.Correo.ToUpper() == email.ToUpper());

            if (registration is null || !registration.IsValid())
                return false;

            registration.Usuario.Estado = true;
            _dbContext.SaveChanges();

            _dbContext.Registros.Remove(registration);
            _dbContext.SaveChanges();

            return true;
        }
    }
}

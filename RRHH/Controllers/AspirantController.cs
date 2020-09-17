using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Math.EC.Rfc7748;
using RRHH.Models;
using RRHH.Models.Database;
using RRHH.Models.Database.Relations;
using RRHH.Models.ViewModels;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AspirantController : ControllerBase
    {
        private readonly MySQLDbContext _dbContext;

        public AspirantController(MySQLDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public bool Create([FromBody] AspirantViewModel model)
        {
            if (model is null || !model.IsValid() || model.Puesto is null ) return false;
            model.Trim();

            bool exists = _dbContext.Candidatos.Any(x => x.Estado == Estado.Activo && (x.Cedula.ToUpper() == model.Cedula.ToUpper() || x.Correo.ToUpper() == model.Correo.ToUpper()));
            if (exists) return false;

            var asp = model.ToCandidato();

            if(asp.Puesto?.PuestoId > 0)
                asp.Puesto = _dbContext.Puestos.FirstOrDefault(x => x.PuestoId == model.Puesto.PuestoId);

            if (asp.Usuario?.UsuarioId > 0)
                asp.Usuario = _dbContext.Usuarios.FirstOrDefault(x => x.UsuarioId == model.Usuario.UsuarioId);

            if (asp.Capacitaciones?.Count() > 0)
                asp.Capacitaciones = _dbContext.Capacitaciones
                    .Where(x => model.Capacitaciones
                        .Select(y => y.CapacitacionId)
                        .Contains(x.CapacitacionId))
                    .ToList();

            if (asp.ExperienciasLaboral?.Count() > 0)
                asp.ExperienciasLaboral = _dbContext.ExperienciasLaboral
                    .Where(x => model.ExperienciasLaboral
                        .Select(y => y.ExperienciaLaboralId)
                        .Contains(x.ExperienciaLaboralId))
                    .ToList();

            if (asp.Idiomas?.Count() > 0)
                asp.Idiomas = _dbContext.Idiomas
                    .Where(x => model.Idiomas
                        .Select(y => y.IdiomaId)
                        .Contains(x.IdiomaId))
                    .Select(x=> new CandidatoIdioma { Idioma = x})
                    .ToList();

            if (asp.Competencias?.Count() > 0)
                asp.Competencias = _dbContext.Competencias
                    .Where(x => model.Competencias
                    .Select(y => y.CompetenciaId)
                    .Contains(x.CompetenciaId))
                    .Select(x=> new CandidatoCompetencia { Competencia = x })
                    .ToList();

            asp.FechaCreacion = DateTime.Now;
            _dbContext.Candidatos.Add(asp);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpGet]
        public IEnumerable<AspirantViewModel> GetAll()
        {
            var result = _dbContext.Candidatos
                              .Where(x=> x.Estado == Estado.Activo)
                              .Include(x => x.Puesto)
                                .ThenInclude(x=> x.Departamento)
                              .OrderByDescending(x => x.Estado)
                                .ThenBy(x => x.Nombre)
                                .ThenBy(x => x.Correo)
                            .Select(x => new AspirantViewModel(x));
            return result;
        }

        [HttpGet]
        public AspirantViewModel Get(int id) 
        {
            var result = _dbContext.Candidatos
                              .Include(x => x.Usuario)
                              .Include(x => x.Puesto)
                                .ThenInclude(x => x.Departamento)
                              .Include(x => x.Capacitaciones)
                                .ThenInclude(x => x.Nivel)
                              .Include(x => x.Competencias)
                                .ThenInclude(x => x.Competencia)
                              .Include(x => x.ExperienciasLaboral)
                              .Include(x => x.Idiomas)
                                .ThenInclude(x => x.Idioma)
                              .FirstOrDefault(x=> x.Estado == Estado.Activo && x.CandidatoId == id);

            return result is null ? null : new AspirantViewModel(result);
        }

        [HttpGet]
        public AspirantViewModel GetByUser(int userId)
        {
            var result = _dbContext.Candidatos
                              .Include(x => x.Usuario)
                              .Include(x => x.Puesto)
                                .ThenInclude(x => x.Departamento)
                              .Include(x => x.Capacitaciones)
                                .ThenInclude(x => x.Nivel)
                              .Include(x => x.Competencias)
                                .ThenInclude(x => x.Competencia)
                              .Include(x => x.ExperienciasLaboral)
                              .Include(x => x.Idiomas)
                                .ThenInclude(x => x.Idioma)
                              .FirstOrDefault(x => x.Estado == Estado.Activo && x.Usuario.UsuarioId == userId);

            if (result is null)
            {
                var user = _dbContext.Usuarios.FirstOrDefault(x => x.Estado == Estado.Activo && x.UsuarioId == userId);
                return user is null ? null : new AspirantViewModel(user);
            }
            else 
            {
                return new AspirantViewModel(result);
            }
        }

        [HttpPut]
        public bool Update([FromBody] AspirantViewModel model)
        {
            if (model is null || !model.IsValid()) return false;
            model.Trim();

            bool exists = _dbContext.Candidatos.Any(x => x.Estado == Estado.Activo && (x.Cedula.ToUpper() == model.Cedula.ToUpper() || x.Correo.ToUpper() == model.Correo.ToUpper()) && x.CandidatoId != model.CandidatoId);
            if (exists) return false;

            var item = _dbContext.Candidatos.Include(x=> x.Usuario)
                                            .Include(x => x.Competencias)
                                            .Include(x => x.Idiomas)
                                            .Include(x => x.Capacitaciones)
                                            .Include(x => x.ExperienciasLaboral)
                                            .FirstOrDefault(x => x.CandidatoId == model.CandidatoId);
            var asp = model.ToCandidato();

            item.Cedula = asp.Cedula;
            item.Nombre = asp.Nombre;
            item.Apellidos = asp.Apellidos;
            item.Telefono = asp.Telefono;
            item.Correo = asp.Correo;
            item.SalarioAspira = asp.SalarioAspira;
            item.RecomendadoPor = asp.RecomendadoPor;
            item.Puesto = _dbContext.Puestos.Include(x=> x.Departamento).FirstOrDefault(x => x.PuestoId == asp.Puesto.PuestoId);
            if (asp.Usuario?.UsuarioId > 0)
                item.Usuario = _dbContext.Usuarios.FirstOrDefault(x => x.UsuarioId == asp.Usuario.UsuarioId);
            item.Estado = asp.Estado;

            if (item.Competencias != null)
                _dbContext.RemoveRange(item.Competencias);
            if (item.Capacitaciones != null)
                _dbContext.RemoveRange(item.Capacitaciones);
            if (item.ExperienciasLaboral != null)
                _dbContext.RemoveRange(item.ExperienciasLaboral);
            if (item.Idiomas != null)
                _dbContext.RemoveRange(item.Idiomas);

            item.Competencias = asp.Competencias;
            item.Capacitaciones = asp.Capacitaciones;
            item.ExperienciasLaboral = asp.ExperienciasLaboral;
            item.Idiomas = asp.Idiomas;

            // Update the user basic info too.
            if (item.Usuario != null) 
            {
                item.Usuario.Nombre = item.Nombre;
                item.Usuario.Apellidos = item.Apellidos;
                item.Usuario.Telefono = item.Telefono;
                item.Usuario.NombreUsuario = item.Usuario.Correo = item.Correo;
                item.Usuario.Cedula = item.Cedula;
            }

            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpDelete]
        public bool Delete(int id)
        {
            if (id <= 0) return false;
            var item = _dbContext.Candidatos.Include(x=> x.Competencias)
                                            .Include(x=> x.Idiomas)
                                            .Include(x=> x.Capacitaciones)
                                            .Include(x=> x.ExperienciasLaboral)
                                            .FirstOrDefault(x => x.CandidatoId == id);
            if (item is null) return false;

            item.Estado = Estado.Eliminado;
            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpPost]
        public bool Hire([FromBody] HireViewModel model) 
        {
            if (model is null || !model.IsValid()) return false;

            var aspirant = _dbContext.Candidatos.Include(x=> x.Puesto).FirstOrDefault(x => x.CandidatoId == model.CandidatoId);
            if (aspirant is null) return false;

            bool exists = _dbContext.Empleados.Any(x=> (x.Cedula == aspirant.Cedula || 
                                                        x.Correo.ToUpper() == aspirant.Correo) && x.Estado == Estado.Activo);
            if(exists) return false;

            var employee = new Empleado 
            {
                Nombre = aspirant.Nombre,
                Apellidos = aspirant.Apellidos,
                Cedula = aspirant.Cedula,
                Correo = aspirant.Correo,
                Puesto = aspirant.Puesto,
                Salario = aspirant.SalarioAspira,
                Estado = aspirant.Estado,
                FechaIngreso = DateTime.Now,
                Candidato = aspirant
            };

            aspirant.Estado = Estado.Inactivo;

            _dbContext.Empleados.Add(employee);
            _dbContext.SaveChanges();

            return true;
        }
    }
}

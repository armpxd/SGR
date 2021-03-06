﻿using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RRHH.Models;
using RRHH.Models.Database;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class EmployeeController : ControllerBase
    {
        private readonly MySQLDbContext _dbContext;

        public EmployeeController(MySQLDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public bool Create([FromBody] Empleado model)
        {
            if (model is null || !model.IsValid()) return false;
            model.Trim();

            bool exists = _dbContext.Empleados.Any(x => x.Cedula.ToUpper() == model.Cedula.ToUpper() || x.Correo.ToUpper() == model.Correo.ToUpper());
            if (exists) return false;

            model.Puesto = _dbContext.Puestos.FirstOrDefault(x => x.PuestoId == model.Puesto.PuestoId);

            _dbContext.Empleados.Add(model);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpGet]
        public IEnumerable<object> GetAll(bool includeInactives = true)
        {
            var result = _dbContext.Empleados.AsQueryable();
            if (includeInactives)
                result = result.Where(x => x.Estado == Estado.Activo || x.Estado == Estado.Inactivo);
            else
                result = result.Where(x => x.Estado == Estado.Activo);

            result = result.Include(x => x.Puesto)
                            .ThenInclude(x => x.Departamento)
                            .OrderByDescending(x => x.Estado)
                            .ThenBy(x => x.Nombre)
                            .ThenBy(x => x.Correo);
            return result;
        }

        [HttpPut]
        public bool Update([FromBody] Empleado model)
        {
            if (model is null || !model.IsValid()) return false;
            model.Trim();

            bool exists = _dbContext.Empleados.Any(x => (x.Cedula.ToUpper() == model.Cedula.ToUpper() || x.Correo.ToUpper() == model.Correo.ToUpper()) && x.EmpleadoId != model.EmpleadoId);
            if (exists) return false;

            var item = _dbContext.Empleados.FirstOrDefault(x => x.EmpleadoId == model.EmpleadoId);

            item.Nombre = model.Nombre;
            item.Apellidos = model.Apellidos;
            item.Correo = model.Correo;
            item.Cedula = model.Cedula;
            item.Estado = model.Estado;
            item.Salario = model.Salario;
            item.FechaIngreso = model.FechaIngreso;

            item.Puesto = _dbContext.Puestos.FirstOrDefault(x => x.PuestoId == model.Puesto.PuestoId);

            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpDelete]
        public bool Delete(int id)
        {
            if (id <= 0) return false;
            var item = _dbContext.Empleados.FirstOrDefault(x => x.EmpleadoId == id);
            if (item is null) return false;

            item.Estado = Estado.Eliminado;
            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        }
    }
}

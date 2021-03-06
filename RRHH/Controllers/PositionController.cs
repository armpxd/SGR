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
    public class PositionController : ControllerBase
    {
        private readonly MySQLDbContext _dbContext;

        public PositionController(MySQLDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public bool Create([FromBody] Puesto model)
        {
            if (model is null || !model.IsValid()) return false;

            var exists = _dbContext.Puestos.Any(x => x.Descripcion.ToUpper() == model.Descripcion.ToUpper());
            if (exists) return false;
            model.Departamento = _dbContext.Departamentos.FirstOrDefault(x => x.DepartamentoId == model.Departamento.DepartamentoId);

            _dbContext.Puestos.Add(model);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpGet]
        public IEnumerable<Puesto> GetAll(bool includeInactives = true)
        {
            var result = _dbContext.Puestos.AsQueryable();
            if (includeInactives)
                result = result.Where(x => x.Estado == Estado.Activo || x.Estado == Estado.Inactivo);
            else
                result = result.Where(x => x.Estado == Estado.Activo);
            result = result.Include(x => x.Departamento)
                           .OrderByDescending(x => x.Estado)
                           .ThenBy(x => x.Descripcion);
            return result;
        }

        [HttpGet]
        public IEnumerable<Puesto> GetByDepartment(int departmentId, bool includeInactives = true)
        {
            var result = _dbContext.Puestos.Where(x => x.Departamento.DepartamentoId == departmentId);
            if (includeInactives)
                result = result.Where(x => x.Estado == Estado.Activo || x.Estado == Estado.Inactivo);
            else
                result = result.Where(x => x.Estado == Estado.Activo);

            result = result.OrderByDescending(x => x.Estado)
                           .ThenBy(x => x.Departamento.Descripcion)
                           .ThenBy(x=> x.Descripcion);
            return result;
        }

        [HttpPut]
        public bool Update([FromBody] Puesto model)
        {
            if (model is null || !model.IsValid()) return false;

            var exists = _dbContext.Puestos.Any(x => x.Descripcion.ToUpper() == model.Descripcion.ToUpper() && x.PuestoId != model.PuestoId);
            if (exists) return false;

            var item = _dbContext.Puestos.FirstOrDefault(x => x.PuestoId == model.PuestoId);
            item.Descripcion = model.Descripcion;
            item.Estado = model.Estado;
            item.Departamento = _dbContext.Departamentos.FirstOrDefault(x => x.DepartamentoId == model.Departamento.DepartamentoId);
            item.SalarioMinimo = model.SalarioMinimo;
            item.SalarioMaximo = model.SalarioMaximo;

            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpDelete]
        public bool Delete(int id)
        {
            if (id <= 0) return false;
            var item = _dbContext.Puestos.FirstOrDefault(x => x.PuestoId == id);
            if (item is null) return false;

            item.Estado = Estado.Eliminado;
            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        } 
    }
}

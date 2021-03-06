﻿using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using RRHH.Models;
using RRHH.Models.Database;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class DepartmentController : ControllerBase
    {
        readonly MySQLDbContext _dbContext;

        public DepartmentController(MySQLDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public bool Create([FromBody] Departamento model)
        {
            if (model is null || !model.IsValid()) return false;

            var exists = _dbContext.Departamentos.Any(x => x.Descripcion.ToUpper() == model.Descripcion.ToUpper());
            if (exists) return false;

            _dbContext.Departamentos.Add(model);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpGet]
        public IEnumerable<Departamento> GetAll(bool includeInactives = true)
        {
            var result = _dbContext.Departamentos.AsQueryable();
            if (includeInactives)
                result = result.Where(x => x.Estado == Estado.Activo || x.Estado == Estado.Inactivo);
            else
                result = result.Where(x => x.Estado == Estado.Activo);

            result = result.OrderByDescending(x => x.Estado)
                           .ThenBy(x => x.Descripcion);
            return result;
        }

        [HttpPut]
        public bool Update([FromBody] Departamento model)
        {
            if (model is null || !model.IsValid()) return false;

            var exists = _dbContext.Departamentos.Any(x => x.Descripcion.ToUpper() == model.Descripcion.ToUpper() && x.DepartamentoId != model.DepartamentoId);
            if (exists) return false;

            var item = _dbContext.Departamentos.FirstOrDefault(x => x.DepartamentoId == model.DepartamentoId);
            item.Descripcion = model.Descripcion;
            item.Estado = model.Estado;

            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpDelete]
        public bool Delete(int id)
        {
            if (id <= 0) return false;
            var item = _dbContext.Departamentos.FirstOrDefault(x => x.DepartamentoId == id);
            if (item is null) return false;

            item.Estado = Estado.Eliminado;
            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        } 
    }
}

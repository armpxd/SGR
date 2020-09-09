using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RRHH.Models.Database;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class CapacitationLevelController : ControllerBase
    {
        readonly MySQLDbContext _dbContext;

        public CapacitationLevelController(MySQLDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public bool Create([FromBody] NivelCapacitacion model)
        {
            if (model is null || !model.IsValid()) return false;

            var exists = _dbContext.NivelesCapacitacion.Any(x => x.Descripcion.ToUpper() == model.Descripcion.ToUpper());
            if (exists) return false;

            _dbContext.NivelesCapacitacion.Add(model);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpGet]
        public IEnumerable<NivelCapacitacion> GetAll()
        {
            var result = _dbContext.NivelesCapacitacion.OrderByDescending(x => x.Estado).ThenBy(x => x.Descripcion);
            return result;
        }

        [HttpPut]
        public bool Update([FromBody] NivelCapacitacion model)
        {
            if (model is null || !model.IsValid()) return false;

            var exists = _dbContext.NivelesCapacitacion.Any(x => x.Descripcion.ToUpper() == model.Descripcion.ToUpper() && x.NivelCapacitacionId != model.NivelCapacitacionId);
            if (exists) return false;

            var item = _dbContext.NivelesCapacitacion.FirstOrDefault(x => x.NivelCapacitacionId == model.NivelCapacitacionId);
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
            var lang = _dbContext.NivelesCapacitacion.FirstOrDefault(x => x.NivelCapacitacionId == id);
            if (lang is null) return false;

            _dbContext.Remove(lang);
            _dbContext.SaveChanges();

            return true;
        } 
    }
}

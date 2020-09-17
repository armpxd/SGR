using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using RRHH.Models;
using RRHH.Models.Database;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class CapacitationLevelController : ControllerBase
    {
        private readonly MySQLDbContext _dbContext;

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
        public IEnumerable<NivelCapacitacion> GetAll(bool includeInactives = true)
        {
            var result = _dbContext.NivelesCapacitacion.AsQueryable();
            if (includeInactives)
                result = result.Where(x => x.Estado == Estado.Activo || x.Estado == Estado.Inactivo);
            else
                result = result.Where(x => x.Estado == Estado.Activo);

            result = result.OrderByDescending(x => x.Estado)
                           .ThenBy(x => x.Descripcion);
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
            var item = _dbContext.NivelesCapacitacion.FirstOrDefault(x => x.NivelCapacitacionId == id);
            if (item is null) return false;

            item.Estado = Estado.Eliminado;
            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        } 
    }
}

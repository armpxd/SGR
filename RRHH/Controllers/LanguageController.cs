using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MimeKit.Encodings;
using RRHH.Models;
using RRHH.Models.Database;
using RRHH.Models.ViewModels;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class LanguageController : ControllerBase
    {
        private readonly MySQLDbContext _dbContext;

        public LanguageController(MySQLDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public bool Create([FromBody] Idioma model)
        {
            if (model is null || !model.IsValid()) return false;

            var exists = _dbContext.Idiomas.Any(x => x.Descripcion.ToUpper() == model.Descripcion.ToUpper());
            if (exists) return false;

            _dbContext.Idiomas.Add(model);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpGet]
        public IEnumerable<Idioma> GetAll(bool includeInactives = true) 
        {
            var result = _dbContext.Idiomas.AsQueryable();
            if (includeInactives)
                result = result.Where(x => x.Estado == Estado.Activo || x.Estado == Estado.Inactivo);
            else
                result = result.Where(x => x.Estado == Estado.Activo);

            result = result.OrderByDescending(x => x.Estado)
                           .ThenBy(x => x.Descripcion);
            return result;
        }

        [HttpPut]
        public bool Update([FromBody] Idioma model)
        {
            if (model is null || !model.IsValid()) return false;

            var exists = _dbContext.Idiomas.Any(x => x.Descripcion.ToUpper() == model.Descripcion.ToUpper() && x.IdiomaId != model.IdiomaId);
            if (exists) return false;

            var item = _dbContext.Idiomas.FirstOrDefault(x => x.IdiomaId == model.IdiomaId);
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
            var item = _dbContext.Idiomas.FirstOrDefault(x => x.IdiomaId == id);
            if (item is null) return false;

            item.Estado = Estado.Eliminado;
            _dbContext.Update(item);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpPost]
        public bool SaveToDB([FromBody] IEnumerable<KeyValue> model) 
        {
            var langs = model.Select(x => new Idioma 
            {
                Descripcion = x.Value,
                Estado = Estado.Activo
            });

            var addedLanguages = _dbContext.Idiomas.Where(x => x.Estado == Estado.Activo && langs.Select(y => y.Descripcion.ToLower()).Contains(x.Descripcion.ToLower()));
            langs = langs.Where(x => !addedLanguages.Select(y => y.Descripcion.ToLower()).Contains(x.Descripcion.ToLower())).ToList();
            if (langs.Count() > 0) {
                _dbContext.AddRange(langs);
                _dbContext.SaveChanges();
                return true;
            }
            return false;
        }
    }
}

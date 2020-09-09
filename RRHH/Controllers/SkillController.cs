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
    public class SkillController : ControllerBase
    {
        readonly MySQLDbContext _dbContext;

        public SkillController(MySQLDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public bool Create([FromBody] Competencia model)
        {
            if (model is null || !model.IsValid()) return false;

            var exists = _dbContext.Competencias.Any(x => x.Descripcion.ToUpper() == model.Descripcion.ToUpper());
            if (exists) return false;

            _dbContext.Competencias.Add(model);
            _dbContext.SaveChanges();

            return true;
        }

        [HttpGet]
        public IEnumerable<Competencia> GetAll()
        {
            var result = _dbContext.Competencias.OrderByDescending(x => x.Estado).ThenBy(x => x.Descripcion);
            return result;
        }

        [HttpPut]
        public bool Update([FromBody] Competencia model)
        {
            if (model is null || !model.IsValid()) return false;

            var exists = _dbContext.Competencias.Any(x => x.Descripcion.ToUpper() == model.Descripcion.ToUpper() && x.CompetenciaId != model.CompetenciaId);
            if (exists) return false;

            var item = _dbContext.Competencias.FirstOrDefault(x => x.CompetenciaId == model.CompetenciaId);
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
            var lang = _dbContext.Competencias.FirstOrDefault(x => x.CompetenciaId == id);
            if (lang is null) return false;

            _dbContext.Remove(lang);
            _dbContext.SaveChanges();

            return true;
        } 
    }
}

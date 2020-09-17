using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    /// <summary>
    /// Test controller. Remove it if you want to publish this site to a production environment.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class Data : ControllerBase
    {
        public MySQLDbContext _dbcontext { get; set; }
        public Data(MySQLDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        [AllowAnonymous]
        [HttpGet("language/getall")]
        public IEnumerable<object> GetLanguages() 
        {
            var result = _dbcontext.Idiomas.Select(x=> new 
            {
                Id = x.IdiomaId,
                Name = x.Descripcion,
                State = x.Estado
            });

            return result;
        }

        [AllowAnonymous]
        [HttpGet("language/get/{id}")]
        public object GetLanguage(int id)
        {
            var result = _dbcontext.Idiomas.Select(x => new
            {
                Id = x.IdiomaId,
                Name = x.Descripcion,
                State = x.Estado
            });

            return result.FirstOrDefault();
        }

        [HttpGet("date")]
        [AllowAnonymous]
        public DateTime GetDate() 
        {
            return DateTime.Now;
        }
    }
}

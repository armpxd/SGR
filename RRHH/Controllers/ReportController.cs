using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RRHH.Models.ViewModels;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly MySQLDbContext _dbContext;

        public ReportController(MySQLDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public IEnumerable<object> GetNewEmployee([FromBody] NewEmployeeReport model) 
        {
            var result = _dbContext.Empleados.AsQueryable();

            if (model.Desde != null && model.Desde != DateTime.MinValue)
                result = result.Where(x => x.FechaIngreso >= model.From);
            if (model.Hasta != null && model.Hasta != DateTime.MinValue)
                result = result.Where(x => x.FechaIngreso <= model.To);

            return result.Include(x => x.Puesto).ThenInclude(x=> x.Departamento);
        }
    }
}

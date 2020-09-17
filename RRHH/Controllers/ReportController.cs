using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RRHH.Models.ViewModels;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ReportController : ControllerBase
    {
        private readonly MySQLDbContext _dbContext;

        public ReportController(MySQLDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public IEnumerable<object> GetNewEmployee([FromBody] NewEmployeeReportViewModel model) 
        {
            var result = _dbContext.Empleados
                                   .Where(x => x.FechaIngreso >= model.From && x.FechaIngreso <= model.To)
                                   .Include(x => x.Puesto)
                                   .ThenInclude(x => x.Departamento);
            return result;
        }
    }
}

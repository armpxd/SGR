using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class Data : ControllerBase
    {
        public MySQLDbContext _dbcontext { get; set; }
        public Data(MySQLDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        [HttpGet("test")]
        public object test() 
        {
            var res = _dbcontext.Puestos.ToList();
            return res;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        private readonly MySQLDbContext _dbcontext;
        private readonly CountryInfoWebService _countryInfo;

        public Data(MySQLDbContext dbcontext, CountryInfoWebService countryInfo)
        {
            _dbcontext = dbcontext;
            _countryInfo = countryInfo;
        }

        [HttpGet("date")]
        [AllowAnonymous]
        public DateTime GetDate() 
        {
            return DateTime.Now;
        }
    }
}

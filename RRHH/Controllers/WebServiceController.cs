using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RRHH.Models;
using RRHH.Models.ViewModels;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WebServiceController : ControllerBase
    {
        private readonly CountryInfoWebService _countryInfo;
        public WebServiceController(CountryInfoWebService countryInfo)
        {
            _countryInfo = countryInfo;
        }

        [HttpGet("language/getall")]
        public async Task<IEnumerable<KeyValue>> GetLanguages() 
        {
            var response = await _countryInfo.GetLanguages();
            return response;
        }
    }
}

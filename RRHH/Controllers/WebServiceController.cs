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

        [HttpGet("company/autocomplete")]
        public async Task<IEnumerable<string>> SearchCompanyAutocomplete(string query) 
        {
            if (string.IsNullOrWhiteSpace(query)) return Enumerable.Empty<string>();
            var data = new List<string> 
            {
                "Claro",
                "Banco Popular",
                "Altice",
                "Vimenca",
                "Solvex"
            };

            return data.Where(x=> x.ToLower().Contains(query.ToLower()));
        }

        [HttpGet("validar/cedula")]
        public async Task<bool> validar_cedula(string ced)
        {
            var c = ced.Replace("-", "");
            var cedula = c.Substring(0, c.Length - 1);
            var verificador = int.Parse(c.Substring(c.Length - 1, 1));
            var suma = 0;
            var cedulaValida = false;

            if (ced.Length < 11) { return cedulaValida; }

            for (int i = 0; i < cedula.Length; i++)
            {
                var mod = 0;
                if ((i % 2) == 0) { mod = 1; } else { mod = 2; }

                var res = int.Parse(cedula.Substring(i, 1)) * mod;
                if (res > 9)
                {
                    var resString = res.ToString();
                    var uno = resString.Substring(0, 1);
                    var dos = resString.Substring(1, 1);
                    res = int.Parse(uno) + int.Parse(dos);
                }
                suma += res;
            }
            var el_numero = (10 - (suma % 10)) % 10;
            if (el_numero == verificador && cedula.Substring(0, 3) != "000")
            {
                cedulaValida = true;
            }
            else
            {
                cedulaValida = false;
            }

            return cedulaValida;
        }
    }
}

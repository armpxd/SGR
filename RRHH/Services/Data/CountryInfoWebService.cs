using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CountryInfoService;
using RRHH.Models;
using RRHH.Models.ViewModels;

namespace RRHH.Services.Data
{
    public class CountryInfoWebService
    {
        private readonly CountryInfoServiceSoapTypeClient client = new CountryInfoServiceSoapTypeClient(CountryInfoServiceSoapTypeClient.EndpointConfiguration.CountryInfoServiceSoap);
        
        public async Task<IEnumerable<KeyValue>> GetLanguages()
        {
            var response = await client.ListOfLanguagesByNameAsync();
            var result = response.Body.ListOfLanguagesByNameResult.Select(x => new KeyValue
            {
                Id = x.sISOCode,
                Value = x.sName
            }).ToList();
            return result;
        }

        public async Task<IEnumerable<KeyValue>> GetCountries()
        {
            var response = await client.ListOfCountryNamesByNameAsync();
            var result = response.Body.ListOfCountryNamesByNameResult.Select(x => new KeyValue
            {
                Id = x.sISOCode,
                Value = x.sName
            }).ToList();
            return result;
        }

        public async Task<KeyValue> GetCountryCurrency(string countryCode)
        {
            var response = await client.CountryCurrencyAsync(countryCode);
            var result = response.Body.CountryCurrencyResult;

            return new KeyValue
            {
                Id = result.sISOCode,
                Value = result.sName
            };
        }

        public async Task<string> GetCountryCapital(string countryCode)
        {
            var response = await client.CapitalCityAsync(countryCode);
            var result = response.Body.CapitalCityResult;
            return result;
        }

    }
}

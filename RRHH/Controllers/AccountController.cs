using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RRHH.Models;
using RRHH.Models.Database;
using RRHH.Models.ViewModels;
using RRHH.Services.Business;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly MySQLDbContext _dbContext;
        private readonly SecurityService _security;
        private readonly AppSettings _appSettings;

        public AccountController(MySQLDbContext dbcontext, SecurityService security, IOptions<AppSettings> appSetting)
        {
            _dbContext = dbcontext;
            _security = security;
            _appSettings = appSetting.Value;
        }

        [HttpPost]
        [AllowAnonymous]
        public object Singin([FromBody] UserLogin model)
        {
            if (model is null || !model.IsValid()) return null;

            string password = _security.Hash(model.Password);
            var user = _dbContext.Usuarios.FirstOrDefault(u => u.NombreUsuario.ToUpper() == model.Username && u.Clave.ToUpper() == password);
            if (user is null) return null;
            string token = this.GenerateJwtToken(user);
            var result = Newtonsoft.Json.JsonConvert.SerializeObject(token);

            return result;
        }

        private string GenerateJwtToken(Usuario user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] 
                { 
                    new Claim("usuarioId", user.UsuarioId.ToString()),
                    new Claim("nombreUsuario", user.NombreUsuario),
                    new Claim("nombre", user.Nombre),
                    new Claim("apellidos", user.Apellidos),
                    new Claim("role", ((int)user.Role).ToString()),
                    new Claim("correo", user.Correo),
                }),
                Expires = DateTime.UtcNow.AddMinutes(_appSettings.ValidMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}

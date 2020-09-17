using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RRHH.Models;
using RRHH.Models.Database;
using RRHH.Models.ViewModels;
using RRHH.Services.Business;
using RRHH.Services.Data;

namespace RRHH.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
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

        private string GenerateJwtToken(Usuario user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_appSettings.Secret);
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

        [HttpPost]
        [AllowAnonymous]
        public object Singin([FromBody] UserLoginViewModel model)
        {
            if (model is null || !model.IsValid()) return null;
            var user = _dbContext.Usuarios.FirstOrDefault(u => u.NombreUsuario.ToUpper() == model.Username && u.Estado == Estado.Activo);

            if (user is null || !_security.CompareHash(model.Password, user.Clave)) return null;

            string token = this.GenerateJwtToken(user);
            var result = JsonSerializer.Serialize(token);

            return result;
        }

        // This method is used for test only. It allow to get a hashed password.
        //[HttpGet]
        //[AllowAnonymous]
        //public async Task<string> GH(string id) 
        //{
        //    string hash = _security.Hash(id);
        //    Task<string> tr = new Task<string>(()=> 
        //    {
        //        Thread.Sleep(2000);
        //        return JsonSerializer.Serialize(hash);
        //    });
        //    tr.Start();
        //    return await tr;
        //}
    }
}

using RRHH.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RRHH.Models.ViewModels
{
    public class Aspirant
    {
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Cedula { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public string RepetirCorreo { get; set; }
        public string Clave { get; set; }
        public string RepetirClave { get; set; }

        public bool IsValid() 
        {
            return !string.IsNullOrWhiteSpace(this.Nombre) &&
                   !string.IsNullOrWhiteSpace(this.Cedula) &&
                   !string.IsNullOrWhiteSpace(this.Telefono) &&
                   !string.IsNullOrWhiteSpace(this.Correo) &&
                   !string.IsNullOrWhiteSpace(this.Clave);
        }

        public void Trim() 
        {
            this.Nombre = this.Nombre?.Trim();
            this.Apellidos = this.Apellidos?.Trim();
            this.Cedula = this.Cedula?.Trim();
            this.Telefono = this.Telefono?.Trim();
            this.Correo = this.Correo?.Trim();
        }

        public Usuario ToUser() 
        {
            return new Usuario 
            {
                NombreUsuario = this.Correo,
                Nombre = this.Nombre,
                Correo = this.Correo,
                Apellidos = this.Apellidos,
                Telefono = this.Telefono,
                Cedula = this.Cedula,
                Clave = this.Clave,
                Estado = false,
                Role = Role.Candidato,
            };
        }
    }
}

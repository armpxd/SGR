using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace RRHH.Models.Database
{
    public class Registro
    {
        public Registro() { }

        public Registro(Usuario usuario)
        {
            var t = Guid.NewGuid().ToString().Replace("-", "").ToUpper();
            this.Token = t.Substring(t.Length - 6, 6);
            this.FechaCreacion = DateTime.Now;
            this.FechaVencimiento = this.FechaCreacion.AddDays(1);
            this.Usuario = usuario;
        }

        [Key]
        public int RegistroId { get; set; }

        [NotNull]
        public string Token { get; set; }

        [NotNull]
        public Usuario Usuario { get; set; }

        [NotNull]
        public DateTime FechaCreacion { get; set; }

        [NotNull]
        public DateTime FechaVencimiento { get; set; }

        public bool IsValid() 
        {
            return DateTime.Now <= this.FechaVencimiento && 
                   DateTime.Now > this.FechaCreacion &&
                   Usuario!= null && Usuario.UsuarioId > 0 &&
                   !string.IsNullOrWhiteSpace(this.Token);
        }
    }
}

using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace RRHH.Models.Database
{
    public class Empleado
    {
        [Key]
        public int EmpleadoId { get; set; }
        
        [NotNull]
        [MaxLength(15)]
        public string Cedula { get; set; }
        
        [NotNull]
        [MaxLength(100)]
        public string Nombre { get; set; }
        
        [MaxLength(100)]
        public string Apellidos { get; set; }

        [MaxLength(100)]
        public string Correo { get; set; }
        
        public DateTime FechaIngreso { get; set; }

        [NotNull]
        public Puesto Puesto { get; set; }
        
        [NotNull]
        [DefaultValue(0)]
        public decimal Salario { get; set; }
        
        [DefaultValue(1)]
        public Estado Estado { get; set; }

        [AllowNull]
        public Candidato Candidato { get; set; }

        public bool IsValid() 
        {
            return !string.IsNullOrWhiteSpace(Cedula) &&
                   !string.IsNullOrWhiteSpace(Nombre) &&
                   FechaIngreso != DateTime.MinValue &&
                   Puesto != null  && Puesto.PuestoId > 0;
        }

        public void Trim() 
        {
            this.Nombre = this.Nombre?.Trim();
            this.Apellidos = this.Apellidos?.Trim();
            this.Correo = this.Correo?.Trim();
            this.Cedula = this.Cedula?.Trim();
        }

    }
}

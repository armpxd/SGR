using RRHH.Models.Database.Relations;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace RRHH.Models.Database
{
    public class Candidato
    {
        [Key]
        public int CandidatoId { get; set; }

        [NotNull]
        [MaxLength(15)]
        public string Cedula { get; set; }

        [NotNull]
        [MaxLength(100)]
        public string Nombre { get; set; }

        [NotNull]
        [MaxLength(100)]
        public string Apellidos { get; set; }

        [NotNull]
        [MaxLength(15)]
        public string Telefono { get; set; }

        [NotNull]
        [MaxLength(100)]
        public string Correo { get; set; }

        [DefaultValue(0)]
        public decimal SalarioAspira { get; set; }

        [MaxLength(100)]
        public string RecomendadoPor { get; set; }

        public Puesto Puesto { get; set; }

        public Usuario Usuario { get; set; }

        public DateTime FechaCreacion { get; set; }

        public Estado Estado { get; set; }

        public List<CandidatoCompetencia> Competencias { get; set; }

        public List<Capacitacion> Capacitaciones { get; set; }

        public List<ExperienciaLaboral> ExperienciasLaboral { get; set; }

        public List<CandidatoIdioma> Idiomas { get; set; }

        public bool IsValid() 
        {
            return !string.IsNullOrWhiteSpace(this.Cedula) &&
                   !string.IsNullOrWhiteSpace(this.Nombre) &&
                   !string.IsNullOrWhiteSpace(this.Correo) &&
                   !string.IsNullOrWhiteSpace(this.Telefono);
        }

        public void Trim() 
        {
            this.Nombre = this.Nombre?.Trim();
            this.Apellidos = this.Apellidos?.Trim();
            this.Cedula = this.Cedula?.Trim();
            this.Telefono = this.Telefono?.Trim();
            this.Correo = this.Correo?.Trim();
            this.RecomendadoPor = this.RecomendadoPor?.Trim();
        }
    }
}

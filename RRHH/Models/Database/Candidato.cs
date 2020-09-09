using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

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
        [MaxLength(15)]
        public string Telefono { get; set; }

        public Puesto PuestoAspira { get; set; }

        public Departamento Departamento { get; set; }

        [DefaultValue(0)]
        public decimal SalarioAspira { get; set; }

        public  IEnumerable<Competencia> Competencias { get; set; }

        public IEnumerable<Capacitacion> Capacitaciones { get; set; }

        public ExperienciaLaboral ExperienciaLaboral { get; set; }

        [MaxLength(100)]
        public string RecomendadoPor { get; set; }

        public Usuario Usuario { get; set; }
    }
}

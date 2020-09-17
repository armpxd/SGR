using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace RRHH.Models.Database
{
    public class ExperienciaLaboral
    {
        [Key]
        public int ExperienciaLaboralId { get; set; }

        [NotNull]
        [MaxLength(150)]
        public string Empresa { get; set; }

        public string Puesto { get; set; }

        public DateTime Desde { get; set; }

        [AllowNull]
        public DateTime? Hasta { get; set; }

        [DefaultValue(0)]
        public decimal Salario { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace RRHH.Models.Database
{
    public class ExperienciaLaboral
    {
        [Key]
        public int ExperienciaLaboralId { get; set; }
        [NotNull]
        [MaxLength(150)]
        public string Empresa { get; set; }
        public Puesto Puesto { get; set; }
        public DateTime Desde { get; set; }
        public DateTime Hasta { get; set; }
        [DefaultValue(0)]
        public decimal Salario { get; set; }

    }
}

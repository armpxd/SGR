using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace RRHH.Models.Database
{
    public class Puesto
    {
        [Key]
        public int PuestoId { get; set; }

        [NotNull]
        [MaxLength(100)]
        public string Descripcion { get; set; }

        [NotNull]
        public Departamento Departamento { get; set; }

        [DefaultValue(0)]
        public NivelRiesgo NivelDeRiesgo { get; set; } = NivelRiesgo.Bajo;

        [NotNull]
        [DefaultValue(0)]
        public decimal SalarioMinimo { get; set; }

        [NotNull]
        [DefaultValue(0)]
        public decimal SalarioMaximo { get; set; }

        [NotNull]
        [DefaultValue(1)]
        public bool Estado { get; set; }

        public bool IsValid() 
        {
            return !string.IsNullOrWhiteSpace(this.Descripcion) && this.Departamento?.DepartamentoId > 0;
        }
    }
}

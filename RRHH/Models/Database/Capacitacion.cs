using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace RRHH.Models.Database
{
    public class Capacitacion
    {
        [Key]
        public int CapacitacionId { get; set; }

        [MaxLength(255)]
        public string Descripcion { get; set; }
        public NivelCapacitacion Nivel { get; set; }
        [NotNull]
        public DateTime Desde { get; set; }
        public DateTime? Hasta { get; set; }
        [MaxLength(100)]
        public string Institucion { get; set; }
    }
}

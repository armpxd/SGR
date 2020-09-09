using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace RRHH.Models.Database
{
    public class Capacitacion
    {
        [Key]
        public int CapacitacionId { get; set; }
        [NotNull]
        [MaxLength(255)]
        public string Descripcion { get; set; }
        public NivelCapacitacion Nivel { get; set; }
        [NotNull]
        public DateTime Desde { get; set; }
        public DateTime Hasta { get; set; }
        [MaxLength(100)]
        public string Institucion { get; set; }
    }
}

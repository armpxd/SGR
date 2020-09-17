using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace RRHH.Models.Database
{
    public class Departamento
    {
        [Key]
        public int DepartamentoId { get; set; }
        [NotNull]
        [MaxLength(100)]
        public string Descripcion { get; set; }

        [NotNull]
        [DefaultValue(1)]
        public Estado Estado { get; set; }

        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(this.Descripcion);
        }
    }
}

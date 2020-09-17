using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace RRHH.Models.Database
{
    public class Idioma
    {
        [Key]
        public int IdiomaId { get; set; }
        [MaxLength(50)]
        [NotNull]
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

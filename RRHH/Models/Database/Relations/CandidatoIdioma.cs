using System.ComponentModel.DataAnnotations;

namespace RRHH.Models.Database.Relations
{
    public class CandidatoIdioma
    {
        [Key]
        public int CandidatoIdiomaId { get; set; }
        public Idioma Idioma { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;


namespace RRHH.Models.Database.Relations
{
    public class CandidatoCompetencia
    {
        [Key]
        public int CandidatoCompetenciaId { get; set; }
        public Competencia Competencia { get; set; }
    }
}

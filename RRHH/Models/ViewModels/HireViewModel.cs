namespace RRHH.Models.ViewModels
{
    public class HireViewModel
    {
        public int CandidatoId { get; set; }

        public bool IsValid() 
        {
            return CandidatoId > 0;
        }
    }
}

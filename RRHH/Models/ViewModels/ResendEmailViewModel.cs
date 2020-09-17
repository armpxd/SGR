namespace RRHH.Models.ViewModels
{
    public class ResendEmailViewModel
    {
        public string Correo { get; set; }

        public bool IsValid() 
        {
            return !string.IsNullOrWhiteSpace(this.Correo);
        }

        public void Trim() 
        {
            this.Correo = this.Correo?.Trim();
        }
    }
}

namespace RRHH.Models.ViewModels
{
    public class RestorePasswordViewModel
    {
        public string Correo { get; set; }
        public string Token { get; set; }
        public string Clave { get; set; }
        public string RepetirClave { get; set; }

        public bool IsValid() 
        {
            return !string.IsNullOrWhiteSpace(this.Correo) && 
                   !string.IsNullOrWhiteSpace(this.Clave) && 
                   !string.IsNullOrWhiteSpace(this.Clave) && 
                   this.Clave == this.RepetirClave;
        }

        public void Trim() 
        {
            this.Correo = this.Correo?.Trim();
            this.Token = this.Token?.Trim();
        }
    }
}

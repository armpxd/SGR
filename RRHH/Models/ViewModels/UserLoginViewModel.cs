namespace RRHH.Models.ViewModels
{
    public class UserLoginViewModel
    {
        public string Username { get; set; }
        public string Password { get; set; }

        public bool IsValid() 
        {
            return !string.IsNullOrWhiteSpace(this.Username) && !string.IsNullOrWhiteSpace(this.Password);
        }
    }
}

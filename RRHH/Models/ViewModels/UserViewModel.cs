using RRHH.Models.Database;

namespace RRHH.Models.ViewModels
{
    public class UserViewModel
    {
        public UserViewModel() { }
        public UserViewModel(Usuario user)
        {
            this.UsuarioId = user.UsuarioId;
            this.NombreUsuario = user.NombreUsuario;
            this.Clave = user.Clave;
            this.Cedula = user.Cedula;
            this.Telefono = user.Telefono;
            this.Nombre = user.Nombre;
            this.Apellidos = user.Apellidos;
            this.Estado = user.Estado;
            this.Role = user.Role;
        }

        public int UsuarioId { get; set; }
        public string NombreUsuario { get; set; }
        public string Clave { get; set; }
        public string Correo { get; set; }
        public string Cedula { get; set; }
        public string Telefono { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public Estado Estado { get; set; }
        public Role Role { get; set; }

        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(this.NombreUsuario) &&
                    !string.IsNullOrWhiteSpace(this.Nombre) &&
                    !string.IsNullOrWhiteSpace(this.Correo) &&
                    !string.IsNullOrWhiteSpace(this.Cedula) &&
                    !string.IsNullOrWhiteSpace(this.Telefono);
        }

        public void Trim()
        {
            this.NombreUsuario = this.NombreUsuario?.Trim();
            this.Nombre = this.Nombre?.Trim();
            this.Correo = this.Correo?.Trim();
            this.Apellidos = this.Apellidos?.Trim();
            this.Cedula = this.Cedula?.Trim();
            this.Telefono = this.Telefono?.Trim();
        }


        public Usuario ToUsuario() 
        {
            return new Usuario 
            {
                UsuarioId= this .UsuarioId,
                NombreUsuario = this.NombreUsuario,
                Clave = this.Clave,
                Correo = this.Correo,
                Cedula = this.Cedula,
                Telefono = this.Telefono,
                Nombre = this.Nombre,
                Apellidos = this.Apellidos,
                Estado = this.Estado,
                Role = this.Role
            };
        }
    }
}

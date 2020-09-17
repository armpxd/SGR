using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace RRHH.Models.Database
{
    public class Usuario
    {
        [Key]
        public int UsuarioId { get; set; }

        [NotNull]
        [MaxLength(40)]
        public  string NombreUsuario  { get; set; }

        [JsonIgnore]
        public string  Clave { get; set; }

        [NotNull]
        [MaxLength(100)]
        public string Correo { get; set; }

        [NotNull]
        [MaxLength(15)]
        public string Cedula { get; set; }

        [NotNull]
        [MaxLength(15)]
        public string Telefono { get; set; }

        [NotNull]
        [MaxLength(100)]
        public string Nombre { get; set; }
        
        [MaxLength(100)]
        public string Apellidos { get; set; }

        [NotNull]
        [DefaultValue(1)]
        public Estado Estado { get; set; }

        [NotNull]
        [DefaultValue(0)]
        public Role Role { get; set; }
    }
}

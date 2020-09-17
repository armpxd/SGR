using Microsoft.EntityFrameworkCore;
using RRHH.Models.Database;

namespace RRHH.Services.Data
{
    public class MySQLDbContext: DbContext
    {
        public MySQLDbContext(DbContextOptions<MySQLDbContext> options) : base(options) { }

        public DbSet<Competencia> Competencias { get; set; }
        public DbSet<Idioma> Idiomas { get; set; }
        public DbSet<Capacitacion> Capacitaciones { get; set; }
        public DbSet<Puesto> Puestos { get; set; }
        public DbSet<Candidato> Candidatos { get; set; }
        public DbSet<ExperienciaLaboral> ExperienciasLaboral { get; set; }
        public DbSet<Empleado> Empleados { get; set; }
        public DbSet<Departamento> Departamentos { get; set; }
        public DbSet<NivelCapacitacion> NivelesCapacitacion { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Registro> Registros { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}

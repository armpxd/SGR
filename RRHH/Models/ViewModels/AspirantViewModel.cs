using RRHH.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RRHH.Models.ViewModels
{
    public class AspirantViewModel
    {
        public AspirantViewModel() { }

        public AspirantViewModel(Candidato model)
        {
            CandidatoId = model.CandidatoId;
            Cedula = model.Cedula;
            Nombre = model.Nombre;
            Apellidos = model.Apellidos;
            Telefono = model.Telefono;
            Correo = model.Correo;
            SalarioAspira = model.SalarioAspira;
            RecomendadoPor = model.RecomendadoPor;
            Puesto = model.Puesto;
            Usuario = model.Usuario;
            FechaCreacion = model.FechaCreacion;
            Estado = model.Estado;
            Competencias = model.Competencias?.Select(x=> x.Competencia)?.ToList();
            Capacitaciones = model.Capacitaciones;
            ExperienciasLaboral = model.ExperienciasLaboral;
            Idiomas = model.Idiomas?.Select(x => x.Idioma)?.ToList();
        }

        public AspirantViewModel(Usuario model)
        {
            Cedula = model.Cedula;
            Nombre = model.Nombre;
            Apellidos = model.Apellidos;
            Telefono = model.Telefono;
            Correo = model.Correo;
            Usuario = model;
            Estado = model.Estado;
        }

        public int CandidatoId { get; set; }
        public string Cedula { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public decimal SalarioAspira { get; set; }
        public string RecomendadoPor { get; set; }
        public Puesto Puesto { get; set; }
        public Usuario Usuario { get; set; }
        public DateTime FechaCreacion { get; internal set; }
        public Estado Estado { get; set; }
        public List<Competencia> Competencias { get; set; }
        public List<Capacitacion> Capacitaciones { get; set; }
        public List<ExperienciaLaboral> ExperienciasLaboral { get; set; }
        public List<Idioma> Idiomas { get; set; }

        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(this.Cedula) &&
                   !string.IsNullOrWhiteSpace(this.Nombre) &&
                   !string.IsNullOrWhiteSpace(this.Correo) &&
                   !string.IsNullOrWhiteSpace(this.Telefono);
        }

        public void Trim()
        {
            this.Nombre = this.Nombre?.Trim();
            this.Apellidos = this.Apellidos?.Trim();
            this.Cedula = this.Cedula?.Trim();
            this.Telefono = this.Telefono?.Trim();
            this.Correo = this.Correo?.Trim();
            this.RecomendadoPor = this.RecomendadoPor?.Trim();
        }

        public Candidato ToCandidato() 
        {
            return new Candidato
            {
                CandidatoId = CandidatoId,
                Cedula = Cedula,
                Nombre = Nombre,
                Apellidos = Apellidos,
                Telefono = Telefono,
                Correo = Correo,
                SalarioAspira = SalarioAspira,
                RecomendadoPor = RecomendadoPor,
                Puesto = Puesto,
                Usuario = Usuario,
                FechaCreacion = FechaCreacion,
                Estado = Estado,
                Capacitaciones = Capacitaciones,
                ExperienciasLaboral = ExperienciasLaboral,
                Competencias = Competencias?.Select(x => new Database.Relations.CandidatoCompetencia
                {
                    Competencia = x
                })?.ToList(),
                Idiomas = Idiomas?.Select(x=> new Database.Relations.CandidatoIdioma 
                {
                    Idioma = x
                })?.ToList()
            };
        }

    }
}

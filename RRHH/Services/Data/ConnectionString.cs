using System;
using System.Linq;

namespace RRHH.Services.Data
{
    public class ConnectionString
    {
        public ConnectionString(string connectionString)
        {
            var cns = connectionString.Trim().Split(";").Select(x => x.Trim());
            foreach (var value in cns)
            {
                if (value.Contains("server", StringComparison.OrdinalIgnoreCase)) Server = value.Split("=")[1];
                else if (value.Contains("data source", StringComparison.OrdinalIgnoreCase)) Server = value.Split("=")[1];
                if (value.Contains("database", StringComparison.OrdinalIgnoreCase)) Database = value.Split("=")[1];
                if (value.Contains("uid", StringComparison.OrdinalIgnoreCase) || value.Contains("user id", StringComparison.OrdinalIgnoreCase)) User = value.Split("=")[1];
                if (value.Contains("pwd", StringComparison.OrdinalIgnoreCase) || value.Contains("password", StringComparison.OrdinalIgnoreCase)) Password = value.Split("=")[1];
                if (value.Contains("port", StringComparison.OrdinalIgnoreCase)) Server = value.Split("=")[1];
            }
            if (this.Server != null)
            {
                if (this.Server.Contains(":"))
                {
                    var spl = this.Server.Split(":");
                    this.Server = spl[0];
                    this.Port = int.Parse(spl[1]);
                }
            }
            else
            {
                this.Server = "localhost";
            }
        }

        public string Server { get; set; }
        public string User { get; set; }
        public string Password { get; set; }
        public int? Port { get; set; }
        public string Database { get; set; }


        public string ToSqlServer()
        {
            string result = string.IsNullOrWhiteSpace(Server) ? "" : $"Server={Server}{(this.Port == null ? "" : $",{this.Port}")};";
            result += string.IsNullOrWhiteSpace(Database) ? "" : $"Database={Database};";
            result += string.IsNullOrWhiteSpace(User) ? "" : $"User Id={User};";
            result += string.IsNullOrWhiteSpace(Password) ? "" : $"Password={Password};";
            return result;
        }

        public string ToMySql()
        {
            string result = string.IsNullOrWhiteSpace(Server) ? "" : $"Server={Server};";
            result += Port == null ? "" : $"Port={Port};";
            result += string.IsNullOrWhiteSpace(Database) ? "" : $"Database={Database};";
            result += string.IsNullOrWhiteSpace(User) ? "" : $"Uid={User};";
            result += string.IsNullOrWhiteSpace(Password) ? "" : $"Pwd={Password};";
            return result;
        }
    }
}

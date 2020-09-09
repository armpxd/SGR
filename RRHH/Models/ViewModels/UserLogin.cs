using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RRHH.Models.ViewModels
{
    public class UserLogin
    {
        public string Username { get; set; }
        public string Password { get; set; }

        public bool IsValid() 
        {
            return !string.IsNullOrWhiteSpace(this.Username) && !string.IsNullOrWhiteSpace(this.Password);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RRHH.Models.ViewModels
{
    public class NewEmployeeReport
    {
        public DateTime? Desde { get; set; }
        public DateTime? Hasta { get; set; }

        internal DateTime From { get 
            {
                if (!Desde.HasValue)
                    return DateTime.MinValue;

                return new DateTime(Desde.Value.Year,Desde.Value.Month, Desde.Value.Day);
            } 
        }
        internal DateTime To
        {
            get
            {
                if (!Hasta.HasValue)
                    return DateTime.MinValue;

                return new DateTime(Hasta.Value.Year, Hasta.Value.Month, Hasta.Value.Day, 23,59,59);
            }
        }
    }
}

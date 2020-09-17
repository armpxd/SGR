using System;

namespace RRHH.Models.ViewModels
{
    public class NewEmployeeReportViewModel
    {
        public DateTime? Desde { get; set; }
        public DateTime? Hasta { get; set; }

        internal DateTime From { get 
            {
                if (!Desde.HasValue)
                    return new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);

                return new DateTime(Desde.Value.Year, Desde.Value.Month, Desde.Value.Day);
            } 
        }
        internal DateTime To
        {
            get
            {
                if (!Hasta.HasValue)
                    return new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 49, 59);

                return new DateTime(Hasta.Value.Year, Hasta.Value.Month, Hasta.Value.Day, 23,59,59);
            }
        }
    }
}

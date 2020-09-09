using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace RRHH.Services.Business
{
    public class EmailService
    {
        private readonly string SenderEmail;
        private readonly SmtpClient smtpClient;
        private readonly EmailConfig config;

        public EmailService(EmailConfig config)
        {
            this.config = config;
            this.SenderEmail = config.SenderEmail;
            this.smtpClient = new SmtpClient()
            {
                Host = config.Host,
                Port = config.Port,
                Credentials = new System.Net.NetworkCredential(config.SenderEmail, config.Password),
                EnableSsl = true
            };
        }

        public EmailService(string senderEmail, string password, string host, int port)
        {
            this.SenderEmail = senderEmail;
            this.smtpClient = new SmtpClient()
            {
                Host = host,
                Port = port,
                Credentials = new System.Net.NetworkCredential(senderEmail, password),
                EnableSsl = true
            };
        }

        public void SendMasive(IEnumerable<string> to, string subject, string body, bool isHTML = false)
        {
            MailMessage mail = new MailMessage()
            {
                From = new MailAddress(this.SenderEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = isHTML
            };

            foreach (var bcc in to)
                mail.Bcc.Add(bcc);

            this.smtpClient.Send(mail);
        }


        public void Send(string to, string subject, string body, bool isHTML = false)
        {
            MailMessage mail = new MailMessage(this.SenderEmail, to, subject, body)
            {
                IsBodyHtml = isHTML
            };

            this.smtpClient.Send(mail);
        }


        public async void SendAsync(string to, string subject, string body, bool isHTML = false)
        {
            MailMessage mail = new MailMessage(this.SenderEmail, to, subject, body)
            {
                IsBodyHtml = isHTML
            };

            await this.smtpClient.SendMailAsync(mail);
        }

        public void SendConfirmationMail(string mail, string name, string token) 
        {
            string link = $"{this.config.ActivationUrl}?email={mail}&token={token}";
            string body = $@"<p>Hola {name}, usted ha creado una cuenta en nuestro sistema de Recursos Humanos. 
                            Utilice el siguiente código para confirmar su cuenta.<p>
                            <h1>{token}</h1>
                            <a href='{link}'>{link}</a>";

            this.Send(mail, "Confirmar correo", body, true);
        }

        public class EmailConfig 
        {
            public string SenderEmail { get; set; }
            public string Password { get; set; }
            public int Port { get; set; }
            public string Host { get; set; }
            public string ActivationUrl { get; set; }
        }
    }
}

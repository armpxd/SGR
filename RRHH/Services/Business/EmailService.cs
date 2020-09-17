

using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace RRHH.Services.Business
{
    public class EmailService
    {
        private readonly EmailConfig config;

        public EmailService(EmailConfig config)
        {
            this.config = config;
        }

        public void Send(string to, string subject, string html)
        {
            try
            {
#if DEBUG
                // Create message
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(config.SenderEmail);
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = subject;
                email.Body = new TextPart(TextFormat.Html) { Text = html };

                // Send email
                using var smtp = new SmtpClient();
                smtp.Connect(config.Host, config.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(config.SenderEmail, config.Password);
                smtp.Send(email);
                smtp.Disconnect(true);
#else
                SednFromSendGrid(to, subject, html).Wait();
#endif
            }
            catch { }
            }

        private async Task SednFromSendGrid(string to, string subject, string html)
        {
            //Get the Send Grid Email service API Key from the environment variables.
            var apiKey = Environment.GetEnvironmentVariable("mvmail_key");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("no-reply@sgrhr.azurewebsites.net", "SGR Mail Service");
            var msg = MailHelper.CreateSingleEmail(from, new EmailAddress(to), subject, "", html);
            var response = await client.SendEmailAsync(msg);
        }

        public void SendConfirmationMail(string mail, string name, string token)
        {
            string htmlTemplate = @"";
            try
            {
                string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "confirmation-email.html");
                if (!File.Exists(path))
                    path = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).FullName, "Templates", "confirmation-email.html");
                if (File.Exists(path))
                    htmlTemplate = File.ReadAllText(path);
            }
            catch (Exception) { }
            string url = config.ActivationURL;
#if !DEBUG
            url = config.ActivationURLProd;
#endif
            string link = $"{url}?email={mail}&token={token}";
            string body = htmlTemplate.Replace("{name}", name)
                                      .Replace("{token}", token)
                                      .Replace("{link}", link);

            this.Send(mail, "Confirmar correo", body);
        }

        public void SendRequestRestorePassword(string mail, string name, string token)
        {
            string htmlTemplate = "";
            try
            {
                string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", "restore-password-email.html");
                if (!File.Exists(path))
                    path = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).FullName, "Templates", "restore-password-email.html");
                if (File.Exists(path))
                    htmlTemplate = File.ReadAllText(path);
            }
            catch (Exception) { }
            string url = config.RestorePasswordURL;
#if !DEBUG
            url = config.RestorePasswordURLProd;
#endif
            string link = $"{url}?email={mail}&token={token}";
            string body = htmlTemplate.Replace("{name}", name)
                                      .Replace("{token}", token)
                                      .Replace("{link}", link);

            this.Send(mail, "Recuperar contraseña", body);
        }

        public class EmailConfig
        {
            public string SenderEmail { get; set; }
            public string Password { get; set; }
            public int Port { get; set; }
            public string Host { get; set; }
            public string ActivationURL { get; set; }
            public string ActivationURLProd { get; set; }
            public string RestorePasswordURL { get; set; }
            public string RestorePasswordURLProd { get; set; }
        }
    }
}

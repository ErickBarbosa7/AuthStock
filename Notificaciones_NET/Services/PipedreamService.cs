using System.Text;
using System.Text.Json;
using Notificaciones_NET.Models;

namespace Notificaciones_NET.Services
{
    public class PipedreamService
    {
        private readonly HttpClient _httpClient;
        
        // URLs de los workflows de Pipedream
        private readonly string _urlEnviar = "https://eo11imcc4mcx6az.m.pipedream.net"; 
        private readonly string _urlValidar = "https://eoxkecxmqhj67in.m.pipedream.net";

        public PipedreamService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Realiza la llamada a Pipedream para enviar el correo de recuperacion
        public async Task<bool> EnviarCorreo(EmailRequest datos)
        {
            try
            {
                var json = JsonSerializer.Serialize(datos);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Envia la informacion al workflow de envio
                var response = await _httpClient.PostAsync(_urlEnviar, content);

                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error enviar: {ex.Message}");
                return false;
            }
        }

        // Llama al workflow que valida el codigo recibido
        public async Task<bool> ValidarCodigo(string nombreUsuario, string codigoIngresado)
        {
            try
            {
                // Se arma el objeto tal como lo espera el workflow
                var payload = new 
                { 
                    name = nombreUsuario, 
                    code = codigoIngresado 
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Envia los datos para validar el codigo
                var response = await _httpClient.PostAsync(_urlValidar, content);

                // Si responde 200, el codigo es valido
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error validar: {ex.Message}");
                return false;
            }
        }
    }
}

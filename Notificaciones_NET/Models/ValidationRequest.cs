using System.Text.Json.Serialization;

namespace Notificaciones_NET.Models
{
    public class ValidationRequest
    {
        // Nombre del usuario que se usa como referencia en el workflow
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        // Codigo ingresado por el usuario para validacion
        [JsonPropertyName("code")]
        public string Code { get; set; } = string.Empty;
    }
}

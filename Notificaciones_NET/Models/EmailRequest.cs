using System.Text.Json.Serialization;

namespace Notificaciones_NET.Models
{
    public class EmailRequest
    {
        // Campo que se enviará en el JSON como "email"
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        // Campo que se enviará en el JSON como "name"
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }
}

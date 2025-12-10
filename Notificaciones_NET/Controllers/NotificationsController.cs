using Microsoft.AspNetCore.Mvc;
using Notificaciones_NET.Models;
using Notificaciones_NET.Services;

namespace Notificaciones_NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly PipedreamService _pipedreamService;

        public NotificationsController(PipedreamService pipedreamService)
        {
            _pipedreamService = pipedreamService;
        }

        // Endpoint para enviar el codigo de recuperacion
        [HttpPost("recover")]
        public async Task<IActionResult> RecoverPassword([FromBody] EmailRequest request)
        {
            // Validacion basica del body
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { error = true, msg = "Faltan datos obligatorios (email, name)." });
            }

            // Envia la solicitud a Pipedream
            bool success = await _pipedreamService.EnviarCorreo(request);

            if (success)
            {
                return Ok(new { success = true, msg = "Codigo enviado. Revise su correo." });
            }
            else
            {
                return StatusCode(500, new { error = true, msg = "No se pudo contactar con Pipedream." });
            }
        }

        // Endpoint para validar el codigo enviado
        [HttpPost("validate")]
        public async Task<IActionResult> ValidateCode([FromBody] ValidationRequest request)
        {
            // Valida datos del body
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Code))
            {
                return BadRequest(new { error = true, msg = "Faltan datos." });
            }

            // Verifica el codigo contra Pipedream
            bool isValid = await _pipedreamService.ValidarCodigo(request.Name, request.Code);

            if (isValid)
            {
                return Ok(new { success = true, msg = "Codigo correcto." });
            }
            else
            {
                return BadRequest(new { error = true, msg = "Codigo incorrecto." });
            }
        }
    }
}

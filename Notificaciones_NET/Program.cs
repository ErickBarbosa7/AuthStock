using Notificaciones_NET.Services;
using System.Text.Json; // Configuracion para la serializacion JSON

var builder = WebApplication.CreateBuilder(args);

// Configura los controladores y define que el JSON use camelCase
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Convierte las propiedades a camelCase al devolver JSON
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.AllowAnyOrigin()  // Permite conexines desde cualquier lugar (incluido localhost:4200)
              .AllowAnyHeader()  // Permite cualquier encabezado
              .AllowAnyMethod(); // Permite GET, POST, PUT, DELETE
    });
});
// Agrega HttpClient para hacer llamadas externas
builder.Services.AddHttpClient();

// Registra el servicio que trabaja con Pipedream
builder.Services.AddScoped<PipedreamService>();

var app = builder.Build();

app.UseCors("AllowAngular");

app.UseAuthorization(); // Middleware de autorizacion

app.MapControllers(); // Mapea las rutas de los controladores

app.Run(); // Inicia la aplicacion

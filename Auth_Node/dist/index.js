"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
console.log("Auth Node Service is running...");
// Inicializamos la aplicación de Express
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware: Permite que el servidor entienda datos en formato JSON
// Esto es CRUCIAL para un sistema de Auth (login/registro)
app.use(express_1.default.json());
// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('¡Servidor de Auth funcionando correctamente! 🚀');
});
// Ruta de "Health Check" (opcional, buena práctica)
app.get('/ping', (req, res) => {
    res.send('pong');
});
// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

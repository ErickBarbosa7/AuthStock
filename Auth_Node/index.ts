import express from 'express';
import cors from 'cors'; // <--- 1. IMPORTAR ESTO
import { connect } from './config/database/DatabaseConnection';
import { SERVER_PORT } from './globals/Environment';
import authRoutes from './routes/AuthRoutes'; 

const app = express();

app.use(cors()); 

app.use(express.json());

// Conectamos la ruta
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API Auth Node lista 🚀');
});

const startServer = async () => {
    try {
        const db = await connect();
        console.log("Conexión exitosa a MySQL (Puerto 3307)");
        await db.end(); 

        app.listen(SERVER_PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${SERVER_PORT}`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar:", error);
    }
};

startServer();
import mysql, { Connection } from "mysql2/promise";
import { HOST_MYSQL, USER_MYSQL, PASSWORD_MYSQL, DATABASE_MYSQL, PORT_MYSQL } from "../../globals/Environment";

// Configuración de la base de datos MySQL
const dbConfig = {
    host: HOST_MYSQL,
    user: USER_MYSQL,
    password: PASSWORD_MYSQL,
    database: DATABASE_MYSQL,
    port: PORT_MYSQL
}

// Función para crear y retornar una conexión a la base de datos
const connect = async (): Promise<Connection> => {
    try {
        // Se establece la conexión usando los parámetros configurados
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    }
    catch (error) {
        // Error si la conexión falla
        throw new Error("Database connection failed: " + error);
    }
}

export { connect };

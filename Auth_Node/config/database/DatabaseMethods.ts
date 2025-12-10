import { connect } from './DatabaseConnection';

class DatabaseMethods {

    // Método para ejecutar INSERT, UPDATE o DELETE
    static async save(sql: { query: string; params: any[] }) {
        let connection;
        try {
            // Se crea la conexión a la base de datos
            connection = await connect();

            // Se ejecuta la query con los parámetros recibidos
            await connection.execute(sql.query, sql.params);

            return { error: false, msg: "Query executed" };
        } 
        catch (error: any) {
            // Error durante la ejecución de la query
            console.log("ERROR EN QUERY (save):", error);
            return { error: true, msg: error.message };
        } 
        finally {
            // Se cierra la conexión si existe
            if (connection) connection.end();
        }
    }

    // Método para SELECT (devuelve resultados; usado para login, etc.)
    static async read(sql: { query: string; params: any[] }) {
        let connection;
        try {
            // Se establece la conexión
            connection = await connect();

            // .execute retorna [rows, fields]; solo ocupamos rows
            const [rows] = await connection.execute(sql.query, sql.params);

            return { error: false, result: rows };
        } 
        catch (error: any) {
            // Error durante el SELECT
            console.log("ERROR EN QUERY (read):", error);
            return { error: true, msg: error.message, result: [] };
        } 
        finally {
            // Se cierra la conexión
            if (connection) connection.end();
        }
    }

    // Método para transacciones (varias queries que deben ejecutarse juntas)
    static async save_transaction(queries: { query: string; params: any[] }[]) {
        let connection;
        try {
            // Se inicia la conexión y la transacción
            connection = await connect();
            await connection.beginTransaction();

            // Ejecución de cada una de las queries dentro de la transacción
            for (let sql of queries) {
                await connection.execute(sql.query, sql.params);
            }

            // Si todas fueron exitosas, se confirma la transacción
            await connection.commit();

            return { error: false, msg: 'queries_executed' };
        } 
        catch (error: any) {
            // Error dentro de la transacción
            console.log("ERROR EN QUERY (transaction):", error);

            // Se revierte todo lo ejecutado
            if (connection) await connection.rollback();

            return { error: true, msg: error.message };
        } 
        finally {
            // Se cierra la conexión siempre
            if (connection) connection.end();
        }
    }
}

export { DatabaseMethods };

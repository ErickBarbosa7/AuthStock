import { connect } from './DatabaseConnection';

class DatabaseMethods {

    // Ejecuta INSERT, UPDATE o DELETE
    static async save(sql: { query: string; params: any[] }) {
        let connection;
        try {
            connection = await connect(); // Crear conexion
            await connection.execute(sql.query, sql.params); // Ejecutar query
            return { error: false, msg: "Query executed" }; // Exito
        } 
        catch (error: any) {
            console.log("ERROR EN QUERY (save):", error); // Log error
            return { error: true, msg: error.message };
        } 
        finally {
            if (connection) connection.end(); // Cerrar conexion
        }
    }

    // Ejecuta SELECT y devuelve resultados
    static async read(sql: { query: string; params: any[] }) {
        let connection;
        try {
            connection = await connect(); // Crear conexion
            const [rows] = await connection.execute(sql.query, sql.params); // Ejecutar SELECT
            return { error: false, result: rows }; // Devolver resultados
        } 
        catch (error: any) {
            console.log("ERROR EN QUERY (read):", error); // Log error
            return { error: true, msg: error.message, result: [] };
        } 
        finally {
            if (connection) connection.end(); // Cerrar conexion
        }
    }

    // Ejecuta varias queries dentro de una transaccion
    static async save_transaction(queries: { query: string; params: any[] }[]) {
        let connection;
        try {
            connection = await connect(); // Crear conexion
            await connection.beginTransaction(); // Iniciar transaccion

            for (let sql of queries) {
                await connection.execute(sql.query, sql.params); // Ejecutar cada query
            }

            await connection.commit(); // Confirmar cambios
            return { error: false, msg: 'queries_executed' };
        } 
        catch (error: any) {
            console.log("ERROR EN QUERY (transaction):", error); // Log error
            if (connection) await connection.rollback(); // Revertir transaccion
            return { error: true, msg: error.message };
        } 
        finally {
            if (connection) connection.end(); // Cerrar conexion
        }
    }
}

export { DatabaseMethods };

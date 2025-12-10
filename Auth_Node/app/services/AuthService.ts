import { DatabaseMethods } from '../../config/database/DatabaseMethods'
import bcrypt from 'bcrypt'

export class AuthService {

    static async signUp(
        id: string, 
        name: string, 
        apellidos: string,
        password_hash: string, 
        email: string, 
        phone: string | null
    ) {
        // Query que inserta un nuevo usuario en la base de datos
        const query = `
            INSERT INTO users (id, nombre, apellidos, email, password, telefono) 
            VALUES (?, ?, ?, ?, ?, ?)
        `

        // Parametros enviados a la base de datos
        const params = [
            id, 
            name, 
            apellidos, 
            email, 
            password_hash, 
            phone || null
        ]

        // Ejecuta el guardado en la base de datos
        const result = await DatabaseMethods.save({ query, params })

        // Manejo de errores, por ejemplo correo duplicado o errores de SQL
        if (result.error) {
            if (result.msg.includes('Duplicate entry')) {
                throw new Error("El correo electronico ya esta registrado")
            }
            throw new Error(result.msg)
        }

        // Respuesta cuando el registro fue exitoso
        return { message: "Usuario registrado correctamente", userId: id }
    }

    static async login(email: string) {
        // Query para obtener un usuario mediante su correo
        const query = "SELECT * FROM users WHERE email = ?"
        const params = [email]

        const response: any = await DatabaseMethods.read({ query, params })

        // Errores o caso donde el usuario no existe
        if (response.error) throw new Error(response.msg)
        if (response.result.length === 0) return null

        const user = response.result[0]

        // Actualizacion de la fecha de ultima sesion
        const updateQuery = "UPDATE users SET fecha_ultima_sesion = NOW() WHERE id = ?"
        await DatabaseMethods.save({ query: updateQuery, params: [user.id] })

        return user
    }

    static async updateUser(id: string, nombre: string, apellidos: string, telefono: string) {
        // Query que actualiza datos basicos del usuario
        const query = `
            UPDATE users 
            SET nombre = ?, apellidos = ?, telefono = ? 
            WHERE id = ?
        `
        const params = [nombre, apellidos, telefono, id]
        
        // Ejecuta la actualizacion
        const result = await DatabaseMethods.save({ query, params })
        
        // Manejo de error si la actualizacion falla
        if (result.error) throw new Error(result.msg)
        
        return { message: "Perfil actualizado correctamente" }
    }
    
    static async changePassword(email: string, newPassword: string) {
        // Encripta la nueva contrasena
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

        // Query para actualizar la contrasena del usuario
        const query = "UPDATE users SET password = ? WHERE email = ?"
        const params = [hashedPassword, email]

        // Ejecuta la actualizacion
        const result = await DatabaseMethods.save({ query, params })

        // Manejo de errores
        if (result.error) {
            throw new Error(result.msg)
        }

        return { message: "Contrasena actualizada correctamente" }
    }
    // Obtener lista simple de usuarios (ID y Nombre) para mostrar en listados
    static async getAllUsers() {
        // Seleccionamos solo los datos necesarios para no hacer pesada la consulta
        const query = "SELECT id, nombre, apellidos FROM users"
        
        // Usamos el metodo read de tu configuracion
        const response: any = await DatabaseMethods.read({ query, params: [] })

        // Manejo de error estandar de tu proyecto
        if (response.error) {
            throw new Error(response.msg)
        }

        // Retornamos el array de usuarios (response.result)
        return response.result
    }
}

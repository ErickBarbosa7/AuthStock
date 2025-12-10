import { AuthService } from "../services/AuthService";
import { Utils } from "../../config/tools/Utils";
import { Jwt } from "../../config/tools/Jwt";

class AuthModel {

    // Registro de un nuevo usuario: genera ID, encripta password y llama al servicio
    static async signUp(name: string, apellidos: string, email: string, password: string, phone: string) {
        const id = Utils.UUID(); // Genera ID unico
        const password_with_hash = await Utils.hash(password); // Encripta password
        return AuthService.signUp(id, name, apellidos, password_with_hash, email, phone);
    }

    // Login con debug para revisar paso a paso
    static async login(email: string, password: string) {
        console.log("\n--- INICIO DEBUG LOGIN ---");
        console.log(`1. Intentando login con email: ${email}`);

        const user = await AuthService.login(email); // Busca usuario por email

        if (!user) {
            console.log("Error: usuario no existe");
            throw new Error("Usuario o contrasena incorrectos");
        }

        console.log(`2. Usuario encontrado (ID: ${user.id})`);
        console.log(`3. Hash guardado en BD: ${user.password}`);
        console.log(`4. Password recibido: ${password}`);

        // Verifica si el password guardado parece hash bcrypt
        if (!user.password.startsWith('$2b$') && !user.password.startsWith('$2a$')) {
            console.log("Aviso: contrasena en BD no parece hash de bcrypt");
        }

        const isPasswordCorrect = await Utils.verify(password, user.password); // Compara password
        console.log(`5. Resultado de verificacion: ${isPasswordCorrect}`);

        if (!isPasswordCorrect) {
            console.log("Error: contrasena no coincide");
            throw new Error("Usuario o contrasena incorrectos");
        }

        console.log("Credenciales validas. Generando token...");

        const token = await Jwt.signIn({ id: user.id, email: user.email }); // Genera JWT

        console.log("--- FIN DEBUG LOGIN ---\n");

        // Devuelve token y datos del usuario
        return { 
            token, 
            user: { 
                id: user.id, 
                nombre: user.nombre, 
                apellidos: user.apellidos, 
                email: user.email, 
                telefono: user.telefono
            } 
        };
    }

    // Actualiza perfil del usuario
    static async updateProfile(id: string, nombre: string, apellidos: string, telefono: string) {
        return await AuthService.updateUser(id, nombre, apellidos, telefono);
    }

    // Cambia la contrasena en caso de olvido
    static async changePassword(email: string, newPassword: string) {
        return await AuthService.changePassword(email, newPassword);
    }
    
    // Obtiene todos los usuarios (delegado al servicio)
    static async getAllUsers() {
        return await AuthService.getAllUsers();
    }
    
}

export { AuthModel };

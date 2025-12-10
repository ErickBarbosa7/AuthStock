import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

class Utils {

    // Genera un UUID v4 unico
    static UUID() {
        return uuidv4();
    }

    // Genera el hash de una contrasena usando bcrypt
    static async hash(password: string) {
        return await bcrypt.hash(password, 8);
    }

    // Verifica si la contrasena ingresada coincide con el hash almacenado
    static async verify(password: string, hash: string) {
        const match = await bcrypt.compare(password, hash).then(function(result){
            return result;
        });
        return match;
    }

    // Valida si un arreglo contiene valores vacios, null o undefined
    static hasEmptyParams(params: (string | null | undefined)[]): boolean {
        return params.some(param => param === null || param === undefined || param == '');
    }
}

export { Utils };
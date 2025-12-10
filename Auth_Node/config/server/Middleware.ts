import { Request, Response, NextFunction } from "express";
import { Jwt } from "../tools/Jwt";
import crypto from 'crypto';
import { log } from "console";

const simpleAuth = crypto.createHash('md5').update('Aqui va tu contraseña').digest('hex');
log(simpleAuth)
const Middleware = (typeAuth: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Respuesta de error estandar
        const error_res = { error: true, msg: 'no_token' };
        try {
            const headers = req.headers;
            if (typeAuth == 0) {
                //Autenticacion simple que es la basada en md5
                //Comparamos el header 'simple
                if (headers['simple'] !== simpleAuth) return res.status(401).json(error_res);
            } else {
                const authHeader = headers['authorization'];
                if (!authHeader) return res.status(401).json(error_res);

                // Quitar el prefijo "Bearer " si existe
                const token = authHeader.startsWith('Bearer ')
                    ? authHeader.split(' ')[1]
                    : authHeader;

                if (!await Jwt.check(token)) return res.status(401).json(error_res);
            }

            next();
        } catch (error) {
            return res.status(500).json(error_res);
        }
    }
}
export { Middleware }
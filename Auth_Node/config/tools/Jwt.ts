import jwt, { JwtPayload } from 'jsonwebtoken';

class Jwt {
    private static readonly key: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9@";
    private static readonly issuer: string = "http://localhost:4200";

    // Crea un token JWT con expiracion de 1 hora
    public static async signIn(data: any): Promise<string> {
        const payload = {
            data: data,
            iss: Jwt.issuer
        };

        const base64Key = Buffer.from(this.key).toString('base64');
        return jwt.sign(payload, base64Key, { expiresIn: '2h' });
    }

    // Verifica si un token es valido
    public static async check(token: string): Promise<boolean> {
        try {
            const base64key = Buffer.from(Jwt.key).toString('base64');

            const decoded = jwt.verify(token, base64key, {
                issuer: Jwt.issuer,
                ignoreExpiration: false
            }) as JwtPayload;

            return true;
        } catch (error) {
            return false;
        }
    }
}

export { Jwt };

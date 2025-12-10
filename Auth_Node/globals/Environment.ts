import * as dotenv from 'dotenv';

dotenv.config();

// Variables de entorno
export const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 3000;

export const HOST_MYSQL: string = process.env.HOST_MYSQL || "127.0.0.1";
export const USER_MYSQL: string = process.env.USER_MYSQL || "root";
export const PASSWORD_MYSQL: string = process.env.PASSWORD_MYSQL || "";
export const DATABASE_MYSQL: string = process.env.DATABASE_MYSQL || "auth_db";

export const PORT_MYSQL: number = Number(process.env.PORT_MYSQL) || 3306;
import { Request, Response } from 'express'
import { AuthModel } from '../models/AuthModel'
import { Utils } from '../../config/tools/Utils'

export class AuthController {

    static async signUp(req: Request, res: Response) {
        try {
            // Datos enviados desde el body
            const { nombre, apellidos, email, password, telefono } = req.body

            // Validar que no falten campos
            if (Utils.hasEmptyParams([nombre, apellidos, email, password])) {
                return res.status(400).json({ 
                    error: "Faltan datos obligatorios (nombre, apellidos, email, password)"
                })
            }

            // Enviar datos al modelo para registrar usuario
            const response = await AuthModel.signUp(nombre, apellidos, email, password, telefono)

            // Respuesta exitosa
            return res.status(201).json(response)

        } catch (error: any) {
            // Manejo de error por correo duplicado o error general
            const statusCode = error.message.includes("ya esta registrado") ? 409 : 500

            return res.status(statusCode).json({ 
                error: "Error al registrar usuario",
                details: error.message
            })
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            // Validar email y password
            if (Utils.hasEmptyParams([email, password])) {
                return res.status(400).json({ 
                    error: "Faltan datos obligatorios (email, password)"
                })
            }

            // Verificar credenciales y generar token
            const response = await AuthModel.login(email, password)

            // Respuesta exitosa
            return res.status(200).json(response)

        } catch (error: any) {
            // Error por datos incorrectos o error interno
            const statusCode = error.message.includes("incorrectos") ? 401 : 500
            
            return res.status(statusCode).json({ 
                error: "Error al iniciar sesion",
                details: error.message
            })
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            // Datos para actualizar el perfil
            const { id, nombre, apellidos, telefono } = req.body

            // Validar campos requeridos
            if (Utils.hasEmptyParams([id, nombre, apellidos])) {
                return res.status(400).json({ error: "Faltan datos" })
            }

            // Actualizar informacion del usuario en el modelo
            const response = await AuthModel.updateProfile(id, nombre, apellidos, telefono)

            return res.status(200).json(response)

        } catch (error: any) {
            return res.status(500).json({ 
                error: "Error al actualizar",
                details: error.message
            })
        }
    }

    static async changePassword(req: Request, res: Response) {
        try {
            const { email, newPassword } = req.body

            // Validar datos requeridos
            if (Utils.hasEmptyParams([email, newPassword])) {
                return res.status(400).json({ error: "Faltan datos (email, newPassword)" })
            }

            // Cambiar la contrasena usando el modelo
            const response = await AuthModel.changePassword(email, newPassword)

            return res.status(200).json(response)

        } catch (error: any) {
            return res.status(500).json({ 
                error: "Error al cambiar contrasena", 
                details: error.message 
            })
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            // Llamamos al modelo para que busque en la BD
            const users = await AuthModel.getAllUsers();

            // Devolvemos la lista (Angular la usará para el diccionario)
            return res.status(200).json(users);

        } catch (error: any) {
            return res.status(500).json({ 
                error: "Error al obtener lista de usuarios",
                details: error.message
            });
        }
    }
}

import { Middleware } from '../config/server/Middleware'
import { AuthController } from './../app/controllers/AuthController'
import { Router } from "express"

const router = Router()

// Ruta para registrar un nuevo usuario
router.post('/signup', AuthController.signUp)

// Ruta para iniciar sesion
router.post('/login', AuthController.login)

// Ruta para actualizar el perfil del usuario
// Incluye middleware para validar el token
router.put('/update', Middleware(1), AuthController.updateProfile)

// Usada para que el Frontend sepa quien registro cada producto
// Tiene Middleware(1) para que solo usuarios logueados puedan ver la lista.
router.get('/users', Middleware(1), AuthController.getAllUsers)

// Ruta para cambiar la contrasena del usuario
router.post('/change-password', AuthController.changePassword)

export default router

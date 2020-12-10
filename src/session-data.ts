declare module "express-session" {
    interface SessionData {
        autenticado: boolean
        tipoUsuario: string
    }
}

export {}
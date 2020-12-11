declare module "express-session" {
    interface SessionData {
        autenticado: boolean
        nomeUsuario: string
        tipoUsuario: string
        fotoUsuario: string
    }
}

export {}
declare module "express-session" {
    interface SessionData {
        autenticado: boolean
        tipoCliente: string
    }
}

export {}
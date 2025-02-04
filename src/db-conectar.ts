import * as mongodb from "mongodb"
import {config} from "./config"
import session from "express-session"
import ConnectMongoDBSession from "connect-mongodb-session"

const Store = ConnectMongoDBSession(session)
export const sessionStore = new Store({
    uri: config.db.url,
    databaseName: config.db.name,
    collection: config.db.collection.sessions
})

const cliente = new mongodb.MongoClient(config.db.url, {useUnifiedTopology: true})

/* Conectar no banco de dados */
export async function conectar(){
    try {
        await cliente.connect()
        console.log("Conectou no banco de dados")
    } catch (error) {
        console.error("Erro ao conectar no banco de dados")
        throw error
    }
}

/* Desconectar do banco de dados */
export async function desconectar(){
    try {
        if (cliente.isConnected()){
            await cliente.close()
            console.log("Conexão com banco de dados foi encerrada")
        }
    } catch (error) {
        console.error("Erro ao fechar conexão com banco de dados")
        throw error
    }
}

export function getDb(){
    return cliente.db(config.db.name)
}
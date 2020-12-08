import { exception } from "console"
import { response } from "express"
import * as fs from "fs"
import { Db } from "mongodb"
import { config } from "./config"
import * as dbConexao from "./db-conectar"

/* Criar as nossas interfaces para cada tipo de dado, por exemplo, 
um para os pedidos, outro para dados cadastrais, etc. */
export interface ToDo {
    'id': number,
    'description': string,
    'tags': string[]
}

export class Usuario {
    nomeUsuario: string
    senha: string

    nomeEmpresa: string
    email: string

    telefone: string
    cnpj: number

    ramoEmpressa: string
    avatarPerfil: string

    tipoUsuario: string

    constructor(nomeUsuario: string, senha: string, nomeEmpresa: string, email: string, telefone: string, cnpj: number, ramoEmpresa: string, avatarPerfil: string, tipoUsuario: string) {
        this.nomeUsuario = nomeUsuario
        this.senha = senha
        this.nomeEmpresa = nomeEmpresa
        this.email = email
        this.telefone = telefone
        this.cnpj = cnpj
        this.ramoEmpressa = ramoEmpresa
        this.avatarPerfil = avatarPerfil
        this.tipoUsuario = tipoUsuario
    }

}

// in-memory model
let model: ToDo[] = []

/**
 * Load data model from disk
 */

/* No caso, a gente pode substuir por uma função que leia do banco de dados */
export function loadFile() {
    try {
        console.log("Loading model from the file system...")
        model = JSON.parse(fs.readFileSync(config["todo-file"]).toString())
        console.log("Model loaded")
    } catch (error) {
        console.error("Failed to load data model from filesystem")
        console.error((error as Error).stack)
    }
}

/**
 * Save data model to disk
 */

/* Atualizar o banco */
export function saveFile() {
    try {
        console.log("Saving model to the file system...")
        fs.writeFileSync(config["todo-file"], JSON.stringify(model))
        console.log("Finished saving data")
    } catch (error) {
        console.error("Failed to save data model to filesystem")
        console.error((error as Error).stack)
    }

}

export class UsuarioDAO {
    private static instancia: UsuarioDAO

    private buscarColecao() {
        return dbConexao.getDb().collection(config.db.collection.usuarios)
    }

    private constructor() { }

    static buscarIntancia(): UsuarioDAO {
        if (!UsuarioDAO.instancia) {
            UsuarioDAO.instancia = new UsuarioDAO()
        }
        return UsuarioDAO.instancia
    }

    async inserir(usuario: Usuario) {
        try {
            const respInsercao = await this.buscarColecao().insertOne(usuario)
            return (respInsercao) ? respInsercao.insertedCount > 0 : false
        } catch (error) {
            console.error("Falha ao inserir o nome usuário")
            throw error

        }
    }

    async buscarUsuario(nomeUsuario: string) {
        try {
            const usuario = await this.buscarColecao().findOne({ nomeUsuario: nomeUsuario })

            if (usuario)
                return usuario as Usuario

        } catch (error) {
            console.error("Usuário não encontrado")
            throw error
        }

        
    }

    async listarTodos() {
        try {
            return await this.buscarColecao().find({}, { projection: { _id: 0 } }).toArray() || []
        } catch (error) {
            console.error("Falha ao listar os usuários");
            throw error

        }
    }
}
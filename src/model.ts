import { exception } from "console"
import { response } from "express"
import * as fs from "fs"
import { Db } from "mongodb"
import { config } from "./config"
import * as dbConexao from "./db-conectar"

/* A Fazer - Criar classes para pedidos e demais entidades que necessitem, parecido com essa que eu fiz */

/* Classe de usuaŕio */
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
/* a fazer - implementar atualização de cadastro */
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
    /* Implementar */
    async atualizarCadatro(usuario: Usuario){

    }
}

/* Implementar DAO semelhante para informações dos pedidos */
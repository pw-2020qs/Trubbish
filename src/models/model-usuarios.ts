import { config } from "../config"
import * as dbConexao from "../db-conectar"
import * as bcrypt from "bcrypt"

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
            // Verifica se usuário já existe antes de inserir
            if(await UsuarioDAO.buscarIntancia().buscarUsuario(usuario.nomeUsuario))
                throw Error("Usuário existente")
            // caso queiram implementar ids incrementais no usuario
            // const newId = await this.nextId()
            // usuario.id = newId 
            // Altera senha inserida por hash do bcrypt utilizando salt = 10
            bcrypt.hash(usuario.senha, 10, async  (err, hash) => {
                usuario.senha = hash
                const respInsercao = await this.buscarColecao().insertOne(usuario)
                return (respInsercao) ? respInsercao.insertedCount > 0 : false
            })

            
        } catch (error) {
            console.error("Falha ao inserir o nome usuário")
            throw error

        }
    }

    async buscarUsuario(nomeUsuario: string) {
        try {
            const usuario = await this.buscarColecao().findOne({ nomeUsuario: nomeUsuario })

            if (usuario){
                return usuario as Usuario
            }
        } catch (error) {
            console.error("Usuário não encontrado")
            throw error
        }

        
    }

    async buscarEmpAtendente(nomeEmpresa: string) {
        try {
            const empresaAtendente = await this.buscarColecao().findOne({ nomeEmpresa: nomeEmpresa })
            // console.log("Teste Atual")
            // console.log(nomeEmpresa)
            // console.log(empresaAtendente)
            if (empresaAtendente){
                return empresaAtendente as Usuario
            }
        } catch (error) {
            console.error("Empresa atendente não encontrada")
            throw error
        }
        
    }

    async buscarEmpPedinte(nomeEmpresa: string) {
        try {
            const empresaPedinte = await this.buscarColecao().findOne({ nomeEmpresa: nomeEmpresa })

            if (empresaPedinte){
                return empresaPedinte as Usuario
            }
        } catch (error) {
            console.error("Empresa pedinte não encontrada")
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
    /* Implementar no controller*/
    async atualizarCadatro(usuario: Usuario){
        try {
            bcrypt.hash(usuario.senha, 10, async  (err, hash) => {
                usuario.senha = hash
                const resposta = await this.buscarColecao().replaceOne({nomeUsuario: usuario.nomeUsuario}, usuario)
                return (resposta) ? resposta.modifiedCount > 0 : false  
            })
        } catch (error) {
            console.error("Não foi possível atualizar o usuário")
            throw error
        }
    }

    async nextId() {
        try {
            const seqColl = dbConexao.getDb()
                .collection(config.db.collection.sequences)
            const result = await seqColl.findOneAndUpdate(
                {name: "usuarios_id"}, 
                {$inc: {value: 1}})
            if (result.ok) {
                return result.value.value as number
            }
            throw Error()
        } catch (error) {
            console.error("Failed to generate a new pedido id")
            throw error
        }
     }
}

/* Implementar DAO semelhante para informações dos pedidos */

export function gerarEmpresaVazia(): Usuario {
    return new Usuario("",
        "",
        "",
        "",
        "",
        0,
        "",
        "",
        "")
}
import { config } from "../config"
import * as dbConexao from "../db-conectar"
import * as bcrypt from "bcrypt"

/* A Fazer - Criar classes para pedidos e demais entidades que necessitem, parecido com essa que eu fiz */

/* Classe de Pedidos */
export class Pedido {
    idPedido: number
    nomeEmpPedinte: string
    nomeEmpAtendente: string
    tipoResiduo: string
    quantidadeResiduo: string
    quantidadeCaminhoes: number
    dataPedido: string
    horaPedido: string
    endereco: string
    tipoPedido: string // coleta || entrega
    status : string //aceito || recusado || pendente

    constructor(nomeEmpPedinte: string, nomeEmpAtendente: string, tipoResiduo: string, quantidadeResiduo: string, endereco: string, tipoPedido: string) {
        this.idPedido = 0
        this.nomeEmpPedinte = nomeEmpPedinte
        this.nomeEmpAtendente = nomeEmpAtendente
        this.tipoResiduo = tipoResiduo
        this.quantidadeResiduo = quantidadeResiduo
        this.quantidadeCaminhoes = 0
        const dataAtual = new Date()
        this.dataPedido = dataAtual.toString()
        this.horaPedido = dataAtual.getHours().toString()
        this.endereco = endereco
        this.tipoPedido = tipoPedido
        this.status = "pendente"
    }

}
/* a fazer - implementar atualização de cadastro */
export class PedidoDAO {
    private static instancia: PedidoDAO

    private buscarColecao() {
        return dbConexao.getDb().collection(config.db.collection.pedidos)
    }

    private constructor() { }

    static buscarIntancia(): PedidoDAO {
        if (!PedidoDAO.instancia) {
            PedidoDAO.instancia = new PedidoDAO()
        }
        return PedidoDAO.instancia
    }

    async inserir(pedido: Pedido) {
        try {
            // Insere pedido no bd            
            const respInsercao = await this.buscarColecao().insertOne(pedido)            
        } catch (error) {
            console.error("Falha ao criar o pedido")
            throw error
        }
    }

    async buscarUsuario(idPedido: number) {
        try {
            const pedido = await this.buscarColecao().findOne({ idPedido: idPedido })

            if (pedido)
                return pedido as Pedido

        } catch (error) {
            console.error("Pedido não encontrado")
            throw error
        }

        
    }

    async listarTodos() {
        try {
            return await this.buscarColecao().find({}, { projection: { _id: 0 } }).toArray() || []
        } catch (error) {
            console.error("Falha ao listar os pedidos");
            throw error

        }
    }
}

/* Implementar DAO semelhante para informações dos pedidos */
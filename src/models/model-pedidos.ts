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
    quantidadeResiduo: number
    quantidadeCaminhoes: number
    dataPedido: string
    horaPedido: string
    endereco: string
    tipoPedido: string // coleta || entrega
    status: string //aceito || recusado || pendente

    constructor(nomeEmpPedinte: string, nomeEmpAtendente: string, tipoResiduo: string, quantidadeResiduo: number,
        dataPedido: string, horaPedido: string, endereco: string, tipoPedido: string) {
        this.idPedido = 0
        this.nomeEmpPedinte = nomeEmpPedinte
        this.nomeEmpAtendente = nomeEmpAtendente
        this.tipoResiduo = tipoResiduo
        this.quantidadeResiduo = quantidadeResiduo
        this.quantidadeCaminhoes = 0
        this.dataPedido = dataPedido
        this.horaPedido = horaPedido
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
            const newId = await this.nextId()
            pedido.idPedido = newId
            const respInsercao = await this.buscarColecao().insertOne(pedido)
            return (respInsercao) ? respInsercao.insertedCount > 0 : false
        } catch (error) {
            console.error("Falha ao criar o pedido")
            throw error
        }
    }

    async buscarPedidos(nomeEmpPedinte: string) {
        try {
            const pedidos = await this.buscarColecao().find({ nomeEmpPedinte: nomeEmpPedinte }).toArray()
            if (pedidos)
                return pedidos as Pedido[]

        } catch (error) {
            console.error("Pedidos não encontrados")
            throw error
        }
    }

    toDate(stringData: string) {
        const newData = stringData.split("/")
        return new Date(parseInt(newData[2]), parseInt(newData[1]) - 1, parseInt(newData[0]))
    }

    async buscarPedidosPassados(nomeEmpPedinte: string) {
        try {

            const pedidos = await this.buscarColecao().find({ nomeEmpPedinte: nomeEmpPedinte }).toArray()

            if (pedidos) {
                let pedidosPassados: Pedido[] = []
                for (let i = 0; i < pedidos.length; i++) {
                    const data = pedidos[i].dataPedido
                    // console.log("data Pedido:")
                    // console.log(this.toDate(data))
                    // console.log("eh Menor que:" + new Date())
                    // console.log(this.toDate(data) < new Date())
                    if (this.toDate(data) < new Date())
                        pedidosPassados.push(pedidos[i])
                }
                // const pedidosPassados = pedidos.filter( x => x.dataPedido.< (new Date().getDate))
                return pedidosPassados as Pedido[]
            }

        } catch (error) {
            console.error("Pedidos não encontrados")
            throw error
        }
    }

    async buscarPedidosFuturos(nomeEmpPedinte: string, tipoUsuario: string) {
        try {
            let pedidos
            if (tipoUsuario == "cliente")
                pedidos = await this.buscarColecao().find({ nomeEmpPedinte: nomeEmpPedinte }).toArray()
            else if (tipoUsuario == "coletor")
                pedidos = await this.buscarColecao().find({ nomeEmpAtendente: nomeEmpPedinte }).toArray()
            if (pedidos) {
                let pedidosFuturos: Pedido[] = []
                for (let i = 0; i < pedidos.length; i++) {
                    const data = pedidos[i].dataPedido
                    if (this.toDate(data) >= new Date())
                        pedidosFuturos.push(pedidos[i])
                }
                // const pedidosPassados = pedidos.filter( x => x.dataPedido.< (new Date().getDate))
                // console.log(pedidosFuturos)
                return pedidosFuturos as Pedido[]
            }

        } catch (error) {
            console.error("Pedidos não encontrados")
            throw error
        }
    }

    async buscarPedido(idPedido: number) {
        try {
            const pedido = await this.buscarColecao().findOne({ idPedido: idPedido })

            if (pedido)
                return pedido as Pedido

        } catch (error) {
            console.error("Pedido não encontrado")
            throw error
        }
    }

    async removerPedido(idPedido: number){
        try {
            const pedido = await this.buscarColecao().deleteOne({ idPedido: idPedido })

        } catch (error) {
            console.error("Pedido não encontrado")
            throw error
        }
    }

    // async remover pedido()

    async listarTodos() {
        try {
            return await this.buscarColecao().find({}, { projection: { _id: 0 } }).toArray() || []
        } catch (error) {
            console.error("Falha ao listar os pedidos");
            throw error

        }
    }

    async nextId() {
        try {
            const seqColl = dbConexao.getDb()
                .collection(config.db.collection.sequences)
            const result = await seqColl.findOneAndUpdate(
                { name: "pedidos_id" },
                { $inc: { value: 1 } })
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

export function ehValido(pedido: Pedido): boolean {
    return (pedido.nomeEmpPedinte.trim() != "" &&
        pedido.nomeEmpAtendente.trim() != "" &&
        pedido.tipoResiduo.trim() != "" &&
        pedido.quantidadeResiduo > 0 &&
        pedido.dataPedido != null &&
        pedido.horaPedido != "" &&
        pedido.endereco.trim() != "")
}

export function gerarPedidoVazio(): Pedido {
    return new Pedido("",
        "",
        "",
        0,
        "",
        "",
        "",
        "coleta")
}
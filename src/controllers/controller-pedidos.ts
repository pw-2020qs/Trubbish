import e from "express"
import * as modelUsr from "../models/model-usuarios"
import * as modelPed from "../models/model-pedidos"

const app = e()

// export function clienteFirst(req: e.Request, res: e.Response) {


//     res.render("cliente")
// }

export async function removerPedido(req: e.Request, res: e.Response) {
    modelPed.PedidoDAO.buscarIntancia().removerPedido(parseInt(req.params.id) || 0)
    res.redirect("/cliente")
}

export async function criarPedidoCliente(req: e.Request, res: e.Response) {
    const nomeUsuario = (req.session.nomeUsuario) ? (req.session.nomeUsuario) : ""

    let nomeEmpPedinte = ""
    const nomeEmpAtendente = req.body.empresa
    const tipoResiduo = req.body.tipoResiduo
    const quantidadeResiduo = req.body.quantidadeResiduo
    const endereco = req.body.endereco
    // const tipoPedido = req.body.coleta
    const tipoPedido = "coleta"
    const dataPedido = req.body.dataPedido
    const horaPedido = req.body.horaPedido

    try {
        const usuarioPedinte = await modelUsr.UsuarioDAO.buscarIntancia().buscarUsuario(nomeUsuario)
        if (usuarioPedinte) {
            nomeEmpPedinte = usuarioPedinte?.nomeEmpresa
        }
        else {
            console.error("Usuário não encontrado no BD")
        }
    } catch(err) {
        console.error("Houve algum erro na obtenção do nome da empresa")
        console.error((err as Error).stack)
        // redirecionar para página de erro
    }

    const novoPedido = new modelPed.Pedido(nomeEmpPedinte,
        nomeEmpAtendente,
        tipoResiduo,
        quantidadeResiduo,
        dataPedido,
        horaPedido,
        endereco,
        tipoPedido)

    try {
        if (modelPed.ehValido(novoPedido)) {
            const pedido = modelPed.PedidoDAO.buscarIntancia().inserir(novoPedido)

            if (pedido) {
                console.log("Pedido criado com successo")
                res.redirect("/cliente")
            }
            else {
                console.error("Houve algum erro no BD durante criação de pedido")
                // redirecionar para página de erro
            }
        } else {
            console.error("O pedido gerado possui campos inválidos")
            return
            // redirecionar para página de erro
        }
    } catch(err) {
        console.error("Houve algum erro na criação de um novo pedido")
        console.error((err as Error).stack)
        // redirecionar para página de erro
    }
}
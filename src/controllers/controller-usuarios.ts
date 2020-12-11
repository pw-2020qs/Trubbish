import e from "express"
import * as path from "path"
import * as modelUsuario from "../models/model-usuarios"
import { config } from "../config"
import bodyParser from "body-parser"
import hbs from "express-handlebars"
import * as fs from "fs"
import * as bcrypt from "bcrypt"
import multipartyExpress from "multiparty-express"

const STATIC_DIR = path.join(__dirname, '..', 'static')

const app = e()

app.engine("handlebars", hbs({
    helpers: {
        equals: (a: string, b: string) => a == b
    }
}))
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname, "..", "views"))

app.use(bodyParser.urlencoded({ extended: true }))


/* Fazer redirecionamento para as telas dos demais tipos de perfils */
app.use('/static', e.static(STATIC_DIR))

app.get("/", (req, res) => {
    res.redirect("/paginaPrincipal")
})

export function cadastro(req: e.Request, res: e.Response) {
    res.render("cadastro", { layout: "naoLogado.handlebars" })
}

export function clienteHome(req: e.Request, res: e.Response) {
    res.render("cliente")
}

export function cliNovoPedido(req: e.Request, res: e.Response) {
    res.render("cliNovoPedido")
}

export function cliHistoricoPedidos(req: e.Request, res: e.Response) {
    res.render("cliHistoricoPedidos")
}

export function cliColetasAgendadas(req: e.Request, res: e.Response) {
    res.render("cliColetasAgendadas")
}

export function alterarCadastro(req: e.Request, res: e.Response) {
    res.render("alterarCadastro")
}

/* Verifica se o usuário existe no banco de dados. Em caso positivos, verifica a senha e o levar para a tela adequada ao tipo de usuário dele */
export async function login(req: e.Request, res: e.Response) {
    console.log("Login: " + req.body.usuario + " senha: " + req.body.senha)

    console.log("Usuário encontrado?")
    const usuario = await modelUsuario.UsuarioDAO.buscarIntancia().buscarUsuario(req.body.usuario)
    if (!usuario) {
        console.log("Não encontrado")
        res.render("paginaPrincipal", { layout: "naoLogado.handlebars", tentouSenhaIncorreta: false })
    }
    else {
        console.log("Usuário encontrado!")

        if (await bcrypt.compare(req.body.senha, usuario.senha)) {
            req.session.autenticado = true
            req.session.nomeUsuario = usuario.nomeUsuario
            req.session.tipoUsuario = usuario.tipoUsuario

            if (usuario.tipoUsuario == "cliente")
                res.redirect("/cliente")
            /* implementar essas telas abaixo e mudar o layout do menu de acordo com o usuário*/
            else if (usuario.tipoUsuario == "coletor")
                res.render("coletor", {layout: "coletorLogado.handlebars"})
            else
                res.render("coletor")
            console.log("Senha correta")
        }
        /* Caso a senha esteja incorreta ou o usuário não exista, retorna para a o menu principal */
        else {
            req.session.autenticado = false
            res.render("paginaPrincipal", { layout: "naoLogado.handlebars", tentouSenhaIncorreta: true })
            console.log("Senha incorreta")
        }

    }


}

/* Implementar, a função para selecionar avatar de perfil, mostrar força da senha e selecionar ramo da empresa */
/* Função cadastrar usuário */

export async function cadastrarUsuario(req: e.Request, res: e.Response) {
    

    const getField = (name: string) =>
        (name in req.fields) ? req.fields[name].pop() : ""
    const saveProfilePicture = async (file: multipartyExpress.File | undefined) => {
        try {
            const fileInfo = await fs.promises.stat(file?.path || "")

            if (file && fileInfo.isFile() && fileInfo.size > 0) {
                const filename = path.basename(file.path)
                const newPath = path.join(config.upload_dir, filename)
                console.log("copiando arquivo")
                await fs.promises.copyFile(file.path, newPath)

                return filename
            }
        } catch (error) {
            console.error("Failed to move profile picture")
            throw error
        }

        return ""
    }

    const nomeUsuario = getField("usuario")
    const senha = getField("senha")
    const nomeEmpresa = getField("nomeEmpresa")
    const email = getField("email")
    const telefone = getField("telefone")
    const cnpj = getField("cnpj")
    const ramoEmpresa = getField("ramoEmpresa")
    const avatarPerfil = getField("avatarPerfil")
    const tipoUsuario = getField("tipoUsuario")

    const profile = new modelUsuario.Usuario(nomeUsuario
        , senha
        , nomeEmpresa
        , email
        , telefone
        , cnpj
        , ramoEmpresa
        , avatarPerfil
        , tipoUsuario)

    console.log(req.files)
    try {

        if ("picture" in req.files) {
            console.log("salvando")
            profile.avatarPerfil =
                await saveProfilePicture(req.files["picture"].pop())
        }
        console.log("Inserindo usuário")
        console.log(profile)
        await modelUsuario.UsuarioDAO.buscarIntancia().inserir(profile)
        res.redirect("/")

    } catch (error) {
        console.error(error)
        res.redirect("/cadastro")
    }

}

export function paginaPrincipal(req: e.Request, res: e.Response) {
    console.log("Página principal")
    res.render("paginaPrincipal", { layout: "naoLogado.handlebars", tentouSenhaIncorreta: false })
}

export function logout(req: e.Request, res: e.Response) {
    if (req.session.autenticado) {
        req.session.autenticado = false
    }
    res.redirect("/paginaPrincipal")
}

/* Implementar funções para carregamento de pedidos, cadastro de pedidos, carregamento de dados agregados para os gráficos, etc */

/* Tratamento personalizado de erros: a fazer */

/* export function errorHandler (err : e.ErrorRequestHandler, req : e.Request, res : e.Response, next : e.NextFunction) {
    res.render("status", {status: "erro_generico"})
}

export function naoEncontrado (req: e.Request, res: e.Response){
    res.render("status", {status: "nao_encontrado"})
} */
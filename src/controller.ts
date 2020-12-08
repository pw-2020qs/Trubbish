import e from "express"
import * as path from "path"
import * as model from "./model"
import bodyParser from "body-parser"
import hbs from "express-handlebars"

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


app.use('/static', e.static(STATIC_DIR))

app.get("/", (req, res) => {
    res.redirect("/paginaPrincipal")
})

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

export async function login(req: e.Request, res: e.Response) {
    console.log("Login: " + req.body.usuario + " senha: " + req.body.senha)
    /* aqui a gente pode mudar para fazer a consulta no banco de dados e validar o usuário 
    em que é feita a consulta usando uma função armazenada no model*/

    console.log("Usuário encontrado?")
    const usuario = await model.UsuarioDAO.buscarIntancia().buscarUsuario(req.body.usuario)
    if (!usuario) {
        console.log("Não encontrado")
        res.render("paginaPrincipal", { layout: "naoLogado.handlebars" })
    }
    else {
        console.log("Usuário encontrado!")
        if (req.body.senha == usuario.senha) {
            res.render("cliente")
            console.log("Senha correta")
        }
        else
        {
            res.render("paginaPrincipal", { layout: "naoLogado.handlebars" })
            console.log("Senha incorreta")
        }
            
    }


}


export function paginaPrincipal(req: e.Request, res: e.Response) {
    console.log("Página principal")
    res.render("paginaPrincipal", { layout: "naoLogado.handlebars" })
}

/* Tratamento personalizado de erros: a fazer */

/* export function errorHandler (err : e.ErrorRequestHandler, req : e.Request, res : e.Response, next : e.NextFunction) {
    res.render("status", {status: "erro_generico"})
}

export function naoEncontrado (req: e.Request, res: e.Response){
    res.render("status", {status: "nao_encontrado"})
} */
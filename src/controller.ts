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

export function cadastro(req: e.Request, res: e.Response) {
    res.render("cadastro", { layout: "naoLogado.handlebars" })
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

/* Verificar se o usuário existe no banco de dados. Em caso positivos, verifica a senha e o levar para a tela adequada ao tipo de usuário dele */
export async function login(req: e.Request, res: e.Response) {
    console.log("Login: " + req.body.usuario + " senha: " + req.body.senha)

    console.log("Usuário encontrado?")
    const usuario = await model.UsuarioDAO.buscarIntancia().buscarUsuario(req.body.usuario)
    if (!usuario) {
        console.log("Não encontrado")
        res.render("paginaPrincipal", { layout: "naoLogado.handlebars" })
    }
    else {
        console.log("Usuário encontrado!")
        if (req.body.senha == usuario.senha) {
            if (usuario.tipoUsuario == "cliente")
                res.render("cliente")
            /* implementar essas telas abaixo e mudar o layout do menu de acordo com o usuário*/
            else if (usuario.tipoUsuario == "coletor")
                res.render("tratamento")
            else
                res.render("coletor")
            console.log("Senha correta")
        }
        /* Caso a senha esteja incorreta ou o usuário não exista, retorna para a o menu principal */
        else {
            res.render("paginaPrincipal", { layout: "naoLogado.handlebars" })
            console.log("Senha incorreta")
        }

    }


}

/* Implementar, a função para selecionar avatar de perfil, mostrar força da senha e selecionar ramo da empresa */
/* Função cadastrar usuário */
export async function cadastrarUsuario(req: e.Request, res: e.Response) {
    const nomeUsuario = req.body.usuario     || ""
    const senha       = req.body.senha       || ""
    const nomeEmpresa = req.body.nomeEmpresa || ""
    const email       = req.body.email       || ""
    const telefone    = req.body.telefone    || ""
    const cnpj        = req.body.cnpj        || ""
    const ramoEmpresa = req.body.ramoEmpresa || ""
    const avatarPerfil= req.body.avatarPerfil|| ""
    const tipoUsuario = req.body.tipoUsuario || "cliente"


    console.log(req.body)
    const usuarioExistente = await model.UsuarioDAO.buscarIntancia().buscarUsuario(req.body.usuario)
    if (usuarioExistente) {
        console.error("Usuário já existente!")
        
    }
    else{
        const novoUsuario = new model.Usuario(nomeUsuario 
            ,senha       
            ,nomeEmpresa 
            ,email       
            ,telefone    
            ,cnpj        
            ,ramoEmpresa 
            ,avatarPerfil
            ,tipoUsuario )
        console.log(novoUsuario)
        await model.UsuarioDAO.buscarIntancia().inserir(novoUsuario)
           
    }
    res.render("paginaPrincipal", { layout: "naoLogado.handlebars" })

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
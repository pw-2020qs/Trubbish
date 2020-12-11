import e from "express"
import * as path from "path"
import * as controllerUsuario from "./controllers/controller-usuarios"
import * as controllerPed from "./controllers/controller-pedidos"
import * as modelCli from "./models/model-usuarios"
import * as modelPed from "./models/model-pedidos"
import bodyParser from "body-parser"
import { config } from "./config"
import * as dbConexao from "./db-conectar"
import hbs from "express-handlebars"
import session from "express-session"
import "./session-data"
import { multipartyExpress as multiparty, cleanup } from "multiparty-express"

const STATIC_DIR = path.join(__dirname, '..', 'static')

const app = e()

/**
 * Configure session middleware
 */
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    store: dbConexao.sessionStore
}))
app.use((req, res, next) => {
    res.locals.autenticado = (req.session.autenticado) ? true : false
    res.locals.nomeUsuario = (req.session.nomeUsuario) ? (req.session.nomeUsuario) : ""
    res.locals.tipoUsuario = (req.session.tipoUsuario) ? (req.session.tipoUsuario) : ""
    next()
})

/**
 * set up handlebars as view engine
 */
app.engine("handlebars", hbs({
    helpers: {
        equals: (a: string, b: string) => a == b
    }
}))
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname, "..", "views"))
//app.engine("handlebars", hbs({ defaultLayout: "main" }))

/**
 * Configure body parser middleware
 */
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * Custom authentication middleware
 */
function autenticar(req: e.Request, res: e.Response, next: e.NextFunction) {
    if (req.session.autenticado) {
        next()
    } else {
        res.redirect("/paginaPrincipal")
    }
}

/**
 * Middleware customizado para usuário tipo cliente
 */
function verificarTipoCliente(req: e.Request, res: e.Response, next: e.NextFunction) {
    if (req.session.tipoUsuario == "cliente") {
        next()
    } else {
        res.redirect("/paginaPrincipal")
    }
}

/**
 * Middleware customizado para usuário tipo coletor
 */
function verificarTipoColetor(req: e.Request, res: e.Response, next: e.NextFunction) {
    if (req.session.tipoUsuario == "coletor") {
        next()
    } else {
        res.redirect("/paginaPrincipal")
    }
}

/**
 * Middleware customizado para usuário tipo tratamento
 */
function verificarTipoTratamento(req: e.Request, res: e.Response, next: e.NextFunction) {
    if (req.session.tipoUsuario == "tratamento") {
        next()
    } else {
        res.redirect("/paginaPrincipal")
    }
}

app.use('/picture', e.static(config.upload_dir));

/**
 * static routes
 */
app.use('/static', e.static(STATIC_DIR))


/**
 * Dynamic routes
 */

/* A fazer - implementar as demais rotas para coletor e tratamento */
app.get("/", controllerUsuario.paginaPrincipal)

app.get("/paginaPrincipal", controllerUsuario.paginaPrincipal)

app.get("/cliente", autenticar, verificarTipoCliente, controllerUsuario.clienteHome)

app.get("/cliColetasAgendadas", autenticar, verificarTipoCliente, controllerUsuario.cliColetasAgendadas)

app.get("/cliHistoricoPedidos", autenticar, verificarTipoCliente, controllerUsuario.cliHistoricoPedidos)

app.get("/alterarCadastro", autenticar, controllerUsuario.alterarCadastro)

app.get("/cliNovoPedido", autenticar, verificarTipoCliente, controllerUsuario.cliNovoPedido)

app.get("/cadastro", controllerUsuario.cadastro)

app.post("/login", controllerUsuario.login)

app.get("/logout", autenticar, controllerUsuario.logout)

app.get("/coleColetasPendentes", autenticar, verificarTipoColetor, controllerUsuario.coleColetasPendentes)

app.get("/coleHistoricoColeta", autenticar, verificarTipoColetor, controllerUsuario.coleHistoricoColeta)

app.get("/coleRecursosColeta", autenticar, verificarTipoColetor, controllerUsuario.coleRecursosColeta)

app.get("/coleGraficosDesempenho", autenticar, verificarTipoColetor, controllerUsuario.coleGraficosDesempenho)

app.get("/")

app.post("/cadastro", multiparty(), (req, res) => {
    controllerUsuario.cadastrarUsuario(req, res)
    cleanup(req)
})

app.post("/alterarCadastro", multiparty(), (req, res) => {
    controllerUsuario.atualizaCadastro(req, res)
    cleanup(req)
})

app.post("/criarPedidoCliente", autenticar, verificarTipoCliente, controllerPed.criarPedidoCliente)



/**
 * OS signal handling
 * Automatic saving of the data model to disk
 * when the server shuts down
 */
process.once('exit', (code) => {
    console.log(`Server exiting with code ${code}...`)
    // model.saveFile()
    console.log(`Server exited`)
})

/* function exitHandler() {
    process.exit()
} */

/* Implementações não testadas */
/* Versão antiga para desligar o servidor */
/* 
process.once("SIGINT", exitHandler)
process.once("SIGUSR2", exitHandler) */

/* Nova versão */
process.once("SIGINT", sairServidor)
process.once("SIGUSR2", sairServidor)

/* Nova versão com conexão ao banco de dados */
console.log("Inicializando o servidor")
dbConexao.conectar()
    .then(
        () => {
            app.listen(config["server-port"], () => {
                // model.loadFile()
                console.log("Servidor pronto! Escutando a porta: " + config["server-port"])
            })
        }
    )
    .catch(error => {
        console.error("Erro ao levantar o servidor")
        console.error(error.stack)
    })

function sairServidor() {
    dbConexao.desconectar()
        .then(() => process.exit())
        .catch(error => {
            console.error("Falhaao desligar o servidor")
        })
}

/* Versão antiga para inicializar o servidor */
/* app.listen(config["server-port"], () => {
    // model.loadFile()
    console.log("Servidor pronto! Escutando a porta: " + config["server-port"])
}) */
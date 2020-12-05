import e from "express"
import * as path from "path"
import * as controller from "./controller"
import * as model from "./model"
import bodyParser from "body-parser"
import { config } from "./config"
import hbs from "express-handlebars"

const STATIC_DIR = path.join(__dirname, '..', 'static')

const app = e()

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
app.engine("handlebars", hbs({defaultLayout: "main"}))

/**
 * Configure body parser middleware
 */
app.use(bodyParser.urlencoded({extended: true}))

/**
 * static routes
 */
app.use('/static', e.static(STATIC_DIR))


/**
 * Dynamic routes
 */
app.get("/", controller.paginaPrincipal) 

app.get("/paginaPrincipal", controller.paginaPrincipal)

app.get("/cliColetasAgendadas", controller.cliColetasAgendadas)

app.get("/cliHistoricoPedidos", controller.cliHistoricoPedidos)

app.get("/cliNovoPedido", controller.cliNovoPedido)

app.post("/login", controller.login)
  


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

function exitHandler() {
    process.exit()
}

process.once("SIGINT", exitHandler)
process.once("SIGUSR2", exitHandler)


app.listen(config["server-port"], () => {
    // model.loadFile()
    console.log("Servidor pronto! Escutando a porta: " + config["server-port"])
})
import { exception } from "console"
import * as fs from "fs"
import {config} from "./config"

/* Criar as nossas interfaces para cada tipo de dado, por exemplo, 
um para os pedidos, outro para dados cadastrais, etc. */
export interface ToDo {
    'id': number,
    'description': string,
    'tags': string[]
}

// in-memory model
let model: ToDo[] = []

/**
 * Load data model from disk
 */

/* No caso, a gente pode substuir por uma função que leia do banco de dados */
export function loadFile() {
    try {
        console.log("Loading model from the file system...")
        model = JSON.parse(fs.readFileSync(config["todo-file"]).toString())
        console.log("Model loaded")
    } catch(error) {
        console.error("Failed to load data model from filesystem")
        console.error((error as Error).stack)
    }
}

/**
 * Save data model to disk
 */

 /* Atualizar o banco */
export function saveFile() {
    try {
        console.log("Saving model to the file system...")
        fs.writeFileSync(config["todo-file"], JSON.stringify(model))
        console.log("Finished saving data")
    } catch(error) {
        console.error("Failed to save data model to filesystem")
        console.error((error as Error).stack)
    }
    
}

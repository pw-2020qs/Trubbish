import * as path from "path"

export const config = {
    'todo-file': path.join(__dirname, '..', 'data', 'todo.json'),
    'server-port': 3000,
    'db':{
        'url' : 'mongodb://localhost:27017',
        'name' : 'trubbish',
        'collection' : {
            'usuarios' : 'usuarios',
            'sessions' : 'sessions'
        }
    },
    'secret': 'session-secret-key'
}
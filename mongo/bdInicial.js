
// Mongoshell script to create an empty profiles db

db = connect('127.0.0.1:27017/trubbish');

// drop db
db.dropDatabase()
// recreate db
db = connect('127.0.0.1:27017/trubbish');
// create collection
db.createCollection('usuarios');

// dados iniciais
db.usuarios.insertOne({
    "nomeUsuario": "cliente"
    // senha hash de "cliente123"
    ,"senha": "$2b$10$H1wVViAXeXIj1svx5ibs3OdVg66c1zGj3o9a8YCXS74ZbB7RzL6bm"
    ,"nomeEmpresa": "Empresa ficticia 1"
    ,"email": "empresa_sem_lixo@empresa1.com.br"
    ,"telefone": "1144202020"
    ,"cnpj": 123456789
    ,"ramoEmpressa": "Eletronicos"
    ,"avatarPerfil": "imagem_pefil_1"
    ,"tipoUsuario": "cliente"
})
/* db.profiles.insertOne({
    "nomeUsuario": "cliente"
    ,"senha": "cliente123"
    ,"nomeEmpresa": "Empresa ficticia 1"
    ,"email": "empresa_sem_lixo@empresa1.com.br"
    ,"telefone": "1144202020"
    ,"cnpj": 123456789
    ,"ramoEmpressa": "Eletronicos"
    ,"avatarPerfil": "imagem_pefil_1"
    ,"tipoUsuario": "cliente"
}) */

// unique index
db.usuarios.createIndex({'nomeUsuario': 1}, {unique: true});






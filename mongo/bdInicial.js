
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
    ,"senha": "cliente123"
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






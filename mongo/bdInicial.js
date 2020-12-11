
// Mongoshell script to create an empty profiles db

db = connect('127.0.0.1:27017/trubbish');

// drop db
db.dropDatabase();
// recreate db
db = connect('127.0.0.1:27017/trubbish');
// create collection

db.createCollection('sequences');
db.sequences.insertOne({
    name: 'usuarios_id',
    value: 1
});
db.sequences.insertOne({
    name: 'pedidos_id',
    value: 5
});

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
    ,"ramoEmpresa": "Eletronicos"
    ,"avatarPerfil": "imagem_pefil_1"
    ,"tipoUsuario": "cliente"
});

db.usuarios.insertOne({
    "nomeUsuario": "coletor"
    // senha hash de "cliente123"
    ,"senha": "$2b$10$H1wVViAXeXIj1svx5ibs3OdVg66c1zGj3o9a8YCXS74ZbB7RzL6bm"
    ,"nomeEmpresa": "Empresa coleta 1"
    ,"email": "empresa_sem_lixo@empresa2.com.br"
    ,"telefone": "1144202020"
    ,"cnpj": 123456789
    ,"ramoEmpresa": "Eletronicos"
    ,"avatarPerfil": "imagem_pefil_1"
    ,"tipoUsuario": "coletor"
});

db.usuarios.insertOne({
    "nomeUsuario": "tratamento"
    // senha hash de "cliente123"
    ,"senha": "$2b$10$H1wVViAXeXIj1svx5ibs3OdVg66c1zGj3o9a8YCXS74ZbB7RzL6bm"
    ,"nomeEmpresa": "Empresa tratamento 1"
    ,"email": "empresa_sem_lixo@empresa3.com.br"
    ,"telefone": "1144202020"
    ,"cnpj": 123456789
    ,"ramoEmpressa": "Eletronicos"
    ,"avatarPerfil": "imagem_pefil_1"
    ,"tipoUsuario": "tratamento"
});

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

db.createCollection('pedidos');

db.pedidos.insertOne({
    "idPedido" : 1
    ,"nomeEmpPedinte" : "Empresa ficticia 1"
    ,"nomeEmpAtendente" : "Empresa coleta 1"
    ,"tipoResiduo" : "Metal"
    ,"quantidadeResiduo" : 10
    ,"quantidadeCaminhoes" : 3
    ,"dataPedido" : "10/11/2020"
    ,"horaPedido" : "15:30"
    ,"endereco" : "Rua nao existente 9999"
    ,"tipoPedido" : "Coleta"
    ,"status" : "aceito"
});

db.pedidos.insertOne({
    "idPedido" : 2
    ,"nomeEmpPedinte" : "Empresa ficticia 1"
    ,"nomeEmpAtendente" : "Empresa coleta 1"
    ,"tipoResiduo" : "Plastico"
    ,"quantidadeResiduo" : 15
    ,"quantidadeCaminhoes" : 5
    ,"dataPedido" : "5/11/2020"
    ,"horaPedido" : "10:00"
    ,"endereco" : "Rua nao existente 9999"
    ,"tipoPedido" : "Coleta"
    ,"status" : "aceito"
});

db.pedidos.insertOne({
    "idPedido" : 3
    ,"nomeEmpPedinte" : "Empresa ficticia 1"
    ,"nomeEmpAtendente" : "Empresa coleta 1"
    ,"tipoResiduo" : "Vidro"
    ,"quantidadeResiduo" : 25
    ,"quantidadeCaminhoes" : 10
    ,"dataPedido" : "25/12/2020"
    ,"horaPedido" : "11:00"
    ,"endereco" : "Rua dingle bell 9999"
    ,"tipoPedido" : "Coleta"
    ,"status" : "aceito"
});

db.pedidos.insertOne({
    "idPedido" : 4
    ,"nomeEmpPedinte" : "Empresa coleta 1"
    ,"nomeEmpAtendente" : "Empresa tratamento 1"
    ,"tipoResiduo" : "Metal"
    ,"quantidadeResiduo" : 10
    ,"quantidadeCaminhoes" : 3
    ,"dataPedido" : "10/11/2020"
    ,"horaPedido" : "15:30"
    ,"endereco" : "Rua nao existente 9999"
    ,"tipoPedido" : "Entrega"
    ,"status" : "aceito"
});

db.pedidos.createIndex({'idPedido': 1}, {unique: true});
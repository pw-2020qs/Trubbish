# Instruções

1. Entrar na pasta do projeto
2. Executar o Yarn para baixar os pacotes necessários
3. Carregar o banco de dados inicial contido na pasta mongo/dbInicial.js no mongoDb
4. Inicializar o servidor, utilizando o nodemon
5. Cadastrar um novo usuário, selecionado o tipo (o tipo cliente é recomendado) ou utilizar um dos usuários já carregados no banco de dados:
  Nome de usuário: cliente
  Senha: cliente123
  tipo de usuário: cliente
  
  Nome de usuário: coletor
  Senha: cliente123
  tipo de usuário: coletor
  
  Nome de usuário: tratamento
  Senha: cliente123
  tipo de usuário: tratamento

# Requisitos

"@types/bcrypt": "^3.0.0",
"@types/connect-mongodb-session": "^2.4.0",
"@types/express": "^4.17.9",
"@types/express-handlebars": "^3.1.0",
"@types/express-session": "^1.17.3",
"@types/mongodb": "^3.6.1",
"@types/node": "^14.14.10",
"bcrypt": "^5.0.0",
"connect-mongodb-session": "^2.4.1",
"express": "^4.17.1",
"express-handlebars": "^5.2.0",
"express-session": "^1.17.1",
"mongodb": "^3.6.3",
"multiparty-express": "^0.1.9"

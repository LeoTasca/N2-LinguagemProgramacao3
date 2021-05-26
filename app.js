//N2 - Linguagem de Programação III - Leonardo Tasca

//importando framework express
const express = require("express");
const app = express();
//servidor da aplicação
const port = 5000;

//importando modulo body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//importando cors para permitir que url tenha permissao de acesso a API
const cors = require("cors");

//importando mongoose para modelar os dados da aplicacao
const mongoose = require("mongoose");
//conectando com o MongoBD 
const uri = 
  "mongodb+srv://dbUser:dbUserPassword@treinamento.okha8.mongodb.net/treinamento?retryWrites=true&w=majority";
mongoose
  .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("Conexão Realizada com Sucesso...");
  })
  .catch((error)=> {
    console.log(error);
  });

//importando participantes e salas
var Participante = require("./schemas/participantes");
var Sala = require("./schemas/salas");

//roteamento
var router = express.Router();

//manipulando a rota para carregar funcoes de middleware em um caminho para todos os metodos de solicitacao
router.use(function(req, res, next) {
  console.log("Operação Realizada no Postman...");
  //definindo site de origem. O * permite que qualquer site faça conexão.
  res.header("Access-Control-Allow-Origin", "*");
  //definindo os metodos
  res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
  //configurando o cors
  app.use(cors());
  next();
});

//testando a rota para ter certeza que esta funcionando
app.get("/", (req, res) => {
  res.send("Bem Vindo ao Sistema de Gerenciamento...");
}); 

app.get("/test",(req,res) => {
  res.send("TESTE...")
});

//rota de verificação da API
router.get("/", function(req, res) {
   res.json({
    message: "Acessando Aplicação..."
   });
});

//rota para acessar http://localhost:5000/api/participantes
router
  .route("/participantes")

//POST - realizar o cadastro de pessoas, com nome e sobrenome
  .post(function(req, res) {
    var participantes = new Participante();
    participantes.nome = req.body.nome;
    participantes.sobrenome = req.body.sobrenome;

    participantes.save(function (error) {
      if (error) res.send(error);
      res.json({ message: "Participante Cadastrado com Sucesso..."});
    });
  })

//GET - realizar a consulta de uma pessoa pelo nome
  .get(function (req, res){
    Participante.find(req.query, function (error, participantes){
      if (error) res.send(error);
      res.json(participantes);
    });
  })

//GET - realizar a listagem de todas as pessoas
  .get(function(req, res) {
    Participante.find(function (error, participantes) {
      if (error) res.send(error);
      res.json(participantes);
    });
  });

//rota para acessar http://localhost:5000/api/participantes/:id
router
  .route("/participantes/:id")

//DELETE - realizar a remoção de uma pessoa pelo id
  .delete(function (req, res) {
    Participante.remove(
      {
        _id: req.params.id
      },
      function (error) {
        if (error) res.send(error);
        res.json({ message: "Participante Excluído com Sucesso..." });
      }
    );
  });

//rota para acessar http://localhost:5000/api/salas
router
  .route("/salas")

//POST - realizar o cadastro das salas do evento, com nome e lotação
  .post(function(req, res) {
    var salas = new Sala();
    salas.nome_sala = req.body.nome_sala;
    salas.lotacao = req.body.lotacao;

    salas.save(function (error) {
      if (error) res.send(error);
      res.json({ message: "Sala Cadastrada com Sucesso..."});
    });
  })

//rota para acessar http://localhost:5000/api/salas/:id
router
  .route("/salas/:id")

//GET - realizar a consulta de uma sala específica pelo id
  .get(function(req, res) {
    Sala.findById(req.params.id, function (error, salas) {
      if (error) res.send(error);
      res.json(salas);
    });
  })


//PUT - atualização de uma sala específica por id
  .put(function(req, res) {
    Sala.findById(req.params.id, function(error, salas) {
        if (error) res.send(error);
        //solicitação de dados para serem validados pelo schema 'salas'
        salas.nome_sala = req.body.nome_sala;
        salas.lotacao = req.body.lotacao;
        salas.save(function(error) {
          if (error) res.send(error);
          res.json({message: "Sala Atualizada com Sucesso..."});
        });
    });
  })

//registrando as rotas com o /api
app.use("/api", router);

//iniciando o servidor
app.listen(port);
console.log("Iniciando a aplicação na porta " + port);
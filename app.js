var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require("path");
var app = express();
var server = http.createServer(app);
var sqlite3 = require('sqlite3').verbose();

// Cria um novo banco de dados
var db = new sqlite3.Database('./database/AluguelV.db');

// Cria a tabela AluguelV
db.run(`CREATE TABLE IF NOT EXISTS AluguelV (
  id INTEGER PRIMARY KEY,
  nome TEXT,
  carro TEXT,
  cpf TEXT,
  cartao TEXT,
  inicio TEXT,
  devolucao TEXT
)`);
console.log("Tabela criada com sucesso");

// Configura o bodyParser para lidar com o corpo das requisições POST
app.use(bodyParser.urlencoded({ extended: false }));

// Configura o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Define as rotas

// Rota GET para exibir o formulário
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './SITE ALUGUEL DE CARROS.html'));
});

// Rota GET para exibir a página de contato
app.get('/contato', function (req, res) {
  res.sendFile(path.join(__dirname, './Paginas_Secundarias/Contato.html'));
});

// Rota GET para exibir a página da empresa
app.get('/empresa', function (req, res) {
  res.sendFile(path.join(__dirname, './Paginas_Secundarias/TEXTO EMPRESA.html'));
});

// Rota GET para exibir a página do Rolls-Royce Cullinann 2019
app.get('/royce', function (req, res) {
  res.sendFile(path.join(__dirname, './Paginas_Secundarias/Rolls-Royce Cullinann 2019.html'));
});

// Rota GET para exibir a página do Lamborghini Urus 2019
app.get('/lamborghini', function (req, res) {
  res.sendFile(path.join(__dirname, './Paginas_Secundarias/Lamborghini Urus 2019.html'));
});

// Rota GET para exibir a página da Ferrari Portofino 2020
app.get('/ferrari', function (req, res) {
  res.sendFile(path.join(__dirname, './Paginas_Secundarias/Ferrari Portofino 2020.html'));
});

// Rota GET para exibir a página do McLaren 570S Coupé
app.get('/mclaren', function (req, res) {
  res.sendFile(path.join(__dirname, './Paginas_Secundarias/McLaren 570S Coupé.html'));
});

// Rota GET para exibir a página do Maserati Levante 2019
app.get('/maseratil', function (req, res) {
  res.sendFile(path.join(__dirname, './Paginas_Secundarias/Maserati Levante 2019.html'));
});

// Rota GET para exibir a página do Maserati Ghibli 2019
app.get('/maserati', function (req, res) {
  res.sendFile(path.join(__dirname, './Paginas_Secundarias/Maserati Ghibli 2019.html'));
});

// Rota POST para processar o formulário
app.post('/processar', function (req, res) {
  db.run(
    // Insere os dados do formulário na tabela AluguelV
    "INSERT INTO AluguelV (id, nome, carro, cpf, cartao, inicio, devolucao) " +
    "VALUES (?, ?, ?, ?, ?, ?, ?)",
    // Valores dos campos do formulário
    [
      req.body.id,
      req.body.nome,
      req.body.carro,
      req.body.cpf,
      req.body.cartao,
      req.body.inicio,
      req.body.devolucao
    ],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("Nova reserva adicionada com sucesso");
      res.send("Dados registrados com sucesso!");
    }
  );
});

// Rota POST para buscar uma reserva pelo ID
app.post('/busca', function (req, res) {
  db.serialize(() => {
    // Encontre a reserva com o ID preenchido
    db.each(
      'SELECT id, nome, carro, cpf, cartao, inicio, devolucao FROM AluguelV WHERE id = ?',
      [req.body.id],
      function (err, row) {
        if (err) {
          res.send("Erro ao encontrar reserva");
          return console.error(err.message);
        }
        res.send(`<p>ID: ${row.id}</p>
                  <p>Nome: ${row.nome}</p>
                  <hr>
                  <p>Carro: ${row.carro}</p>
                  <hr>
                  <p>CPF: ${row.cpf}</p>
                  <hr>
                  <p>Cartão: ${row.cartao}</p>
                  <hr>
                  <p>Início da Locação: ${row.inicio}</p>
                  <hr>
                  <p>Devolução: ${row.devolucao}</p>
                  <hr>`);
        console.log("Reserva encontrada");
      }
    );
  });
});

// Rota POST para alterar uma reserva
app.post('/alterar', function (req, res) {
  db.serialize(() => {
    db.run(
      // Atualizar a reserva no banco de dados
      "UPDATE AluguelV " +
      "SET id=?, nome=?, carro=?, cpf=?, cartao=?, inicio=?, devolucao=? " +
      "WHERE id=?",
      // Valores dos campos do formulário
      [
        req.body.id,
        req.body.nome,
        req.body.carro,
        req.body.cpf,
        req.body.cartao,
        req.body.inicio,
        req.body.devolucao,
        req.body.id
      ],
      // Depois de executar o SQL, esta função é executada
      function (err) {
        // Se houver algum problema na atualização, mostre um erro
        if (err) {
          return console.log(err.message);
        }
        console.log("Registro atualizado.");
        res.send("Reserva " + req.body.id + " atualizada com sucesso.");
      }
    );
  });
});

// Rota POST para remover uma reserva
app.post('/remover', function (req, res) {
  db.serialize(() => {
    db.run(
      // Remover uma reserva com um ID específico
      "DELETE FROM AluguelV WHERE id=?",
      [req.body.id],
      // Depois de executar o SQL, esta função é executada
      function (err) {
        // Se houver algum problema na exclusão, mostre um erro
        if (err) {
          return console.log(err.message);
        }
        console.log("Registro removido.");
        res.send("Reserva " + req.body.id + " removida com sucesso.");
      }
    );
  });
});

// Inicia o servidor
server.listen(3334, function () {
  console.log("Server listening on port: 3334");
});
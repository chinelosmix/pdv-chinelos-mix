const express = require('express');
const path = require('path');

const app = express();

// JSON
app.use(express.json());

// SERVIR INDEX
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// SERVIR ARQUIVOS
app.use(express.static(__dirname));

// TESTE
app.get('/teste', (req, res) => {
  res.send("Servidor OK");
});

// PORTA
app.listen(3001, '0.0.0.0', () => {
  console.log("Servidor rodando na porta 3001");
});
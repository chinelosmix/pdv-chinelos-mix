const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let usuarios = [{ user: "admin", senha: "123" }];
let produtos = [];
let vendas = [];

// LOGIN
app.post('/login', (req, res) => {
  const { user, senha } = req.body;
  const ok = usuarios.find(u => u.user === user && u.senha === senha);
  res.json({ ok });
});

// PRODUTOS
app.get('/produtos', (req, res) => res.json(produtos));

app.post('/produtos', (req, res) => {
  produtos.push(req.body);
  res.json({ ok: true });
});

// VENDA
app.post('/venda', (req, res) => {
  vendas.push(req.body);
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando");
});

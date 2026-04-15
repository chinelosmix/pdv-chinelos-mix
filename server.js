const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// ===== BANCO SIMPLES (memória) =====
let usuarios = [{ user: "admin", senha: "123" }];
let produtos = [];
let vendas = [];
let funcionarios = [];

// ===== SERVIR HTML =====
app.use(express.static(__dirname));

// ===== LOGIN =====
app.post('/login', (req, res) => {
  const { user, senha } = req.body;
  const ok = usuarios.find(u => u.user === user && u.senha === senha);
  if (ok) return res.json({ ok: true });
  res.json({ ok: false });
});

// ===== PRODUTOS =====
app.post('/produto', (req, res) => {
  produtos.push(req.body);
  res.json({ ok: true });
});

app.get('/produtos', (req, res) => {
  res.json(produtos);
});

// ===== VENDAS =====
app.post('/venda', (req, res) => {
  vendas.push(req.body);
  res.json({ ok: true });
});

app.get('/vendas', (req, res) => {
  res.json(vendas);
});

// ===== FUNCIONÁRIOS =====
app.post('/funcionario', (req, res) => {
  funcionarios.push(req.body);
  res.json({ ok: true });
});

app.get('/funcionarios', (req, res) => {
  res.json(funcionarios);
});

// ===== PORTA RAILWAY =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});

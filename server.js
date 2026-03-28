const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// USUÁRIOS
let usuarios = [
  { user: "admin", senha: "123" }
];

// CADASTRO
app.post('/cadastrar', (req, res) => {
  const { user, senha } = req.body;

  if (!user || !senha) return res.status(400).json({ msg: "Preencha tudo" });

  if (usuarios.find(u => u.user === user)) {
    return res.status(400).json({ msg: "Usuário já existe" });
  }

  usuarios.push({ user, senha });
  res.json({ ok: true });
});

// LOGIN
app.post('/login', (req, res) => {
  const { user, senha } = req.body;

  const ok = usuarios.find(u => u.user === user && u.senha === senha);

  if (ok) res.json({ ok: true });
  else res.status(401).json({ ok: false });
});

// NF-e (SIMULAÇÃO PRONTA PRA API REAL)
app.post('/nf', (req, res) => {
  console.log("Emitir NF:", req.body);
  res.json({ ok: true, msg: "NF enviada (simulação)" });
});

// FRONT
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log("Servidor rodando");
});
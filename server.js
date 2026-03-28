const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// 👇 banco simples (memória)
let usuarios = [
  { user: "admin", senha: "123" }
];

// CADASTRAR
app.post('/cadastrar', (req, res) => {
  const { user, senha } = req.body;

  if (!user || !senha) {
    return res.status(400).json({ msg: "Preencha tudo" });
  }

  const existe = usuarios.find(u => u.user === user);

  if (existe) {
    return res.status(400).json({ msg: "Usuário já existe" });
  }

  usuarios.push({ user, senha });

  res.json({ ok: true });
});

// LOGIN
app.post('/login', (req, res) => {
  const { user, senha } = req.body;

  const encontrado = usuarios.find(u => u.user === user && u.senha === senha);

  if (encontrado) {
    return res.json({ ok: true });
  } else {
    return res.status(401).json({ ok: false });
  }
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
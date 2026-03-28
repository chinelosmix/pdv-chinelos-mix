const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// 🔐 usuários simples (depois podemos melhorar)
let usuarios = [
  { user: "admin", senha: "123" }
];

// login
app.post('/login', (req, res) => {
  const { user, senha } = req.body;

  const encontrado = usuarios.find(u => u.user === user && u.senha === senha);

  if (encontrado) {
    return res.json({ ok: true });
  } else {
    return res.status(401).json({ ok: false });
  }
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

// ROTA TESTE
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// LOGIN
app.post('/login', (req, res) => {
  const { user, senha } = req.body;

  if (user === "admin" && senha === "123") {
    return res.json({ ok: true });
  } else {
    return res.status(401).json({ ok: false });
  }
});

// SERVIR ARQUIVOS
app.use(express.static(__dirname));

// PORTA DO RAILWAY (ESSENCIAL)
const PORT = process.env.PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log("Rodando na porta " + PORT);
});
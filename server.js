
const express = require('express');
const path = require('path');

const app = express();

// ESSENCIAL
app.use(express.json());

// TESTE RÁPIDO (pra ver se tá vivo)
app.get('/teste', (req, res) => {
  res.send('Servidor OK');
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

// SERVIR FRONT
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// PORTA CORRETA DO RAILWAY
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
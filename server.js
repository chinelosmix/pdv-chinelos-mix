
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

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
app.use(express.static(__dirname));

// HOME → INDEX
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// PORTA RAILWAY
const PORT = process.env.PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log("Servidor rodando na porta " + PORT);
});
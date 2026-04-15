const express = require('express');
const app = express();

app.use(express.json());

// servir o site
app.use(express.static(__dirname + '/público'));

// login
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === "admin" && senha === "123") {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

// venda
app.post('/venda', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando");
});

const express = require('express');
const app = express();

app.use(express.json());

// 🔥 SERVE A PASTA PUBLICO
app.use(express.static('público'));

// LOGIN
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if(usuario === "admin" && senha === "123"){
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

// VENDA (pra não dar erro)
app.post('/venda', (req, res) => {
  console.log("Venda recebida:", req.body);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});

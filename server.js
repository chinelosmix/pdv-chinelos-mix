const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let usuarios = [{ usuario: "admin", senha: "123" }];

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  const ok = usuarios.find(u => u.usuario === usuario && u.senha === senha);

  res.json({ ok: !!ok });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta " + PORT));

const express = require('express');
const path = require('path');

const app = express();

// 👉 PORTA AUTOMÁTICA (ESSENCIAL PRO RAILWAY)
const PORT = process.env.PORT || 3001;

// 👉 SERVIR ARQUIVOS (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// 👉 ROTA PRINCIPAL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 👉 INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
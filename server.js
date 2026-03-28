const express = require('express');
const path = require('path');

const app = express();

// 👉 ESSENCIAL
app.use(express.json());

// 👉 LOGIN FUNCIONANDO
app.post('/login', (req, res) => {
  const { user, senha } = req.body;

  console.log("Recebido:", user, senha);

  if (user === "admin" && senha === "123") {
    return res.json({ ok: true });
  } else {
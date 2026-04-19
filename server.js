const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

// 👇 SERVIR FRONTEND
app.use(express.static(__dirname));

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'));
});

let produtos = [];
let vendas = [];
let funcionarios = [];

// LOGIN
app.post('/login',(req,res)=>{
  const {nome, senha} = req.body;
  const f = funcionarios.find(x=>x.nome===nome && x.senha===senha);
  if(!f) return res.status(401).json({erro:true});
  res.json(f);
});

// PRODUTOS
app.get('/produtos',(req,res)=> res.json(produtos));

app.post('/produtos',(req,res)=>{
  produtos.push(req.body);
  res.json({ok:true});
});

// VENDAS
app.post('/venda',(req,res)=>{
  vendas.push(req.body);
  res.json({ok:true});
});

app.get('/relatorio',(req,res)=> res.json(vendas));

// FUNCIONARIOS
app.post('/funcionario',(req,res)=>{
  funcionarios.push(req.body);
  res.json({ok:true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));

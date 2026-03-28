const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

let usuarios = [{ user: "admin", senha: "123" }];
let produtos = [];
let vendas = [];

// LOGIN
app.post('/login',(req,res)=>{
  const {user,senha}=req.body;
  if(usuarios.find(u=>u.user===user && u.senha===senha))
    res.json({ok:true});
  else res.status(401).json({ok:false});
});

// CADASTRAR FUNCIONARIO
app.post('/cadastrar',(req,res)=>{
  const {user,senha}=req.body;
  usuarios.push({user,senha});
  res.json({ok:true});
});

// PRODUTO
app.post('/produto',(req,res)=>{
  produtos.push(req.body);
  res.json({ok:true});
});

app.get('/produtos',(req,res)=>{
  res.json(produtos);
});

// VENDA
app.post('/venda',(req,res)=>{
  vendas.push({...req.body, data:new Date()});
  res.json({ok:true});
});

// RELATORIO
app.get('/relatorio',(req,res)=>{
  res.json(vendas);
});

app.use(express.static(__dirname));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));

const PORT = process.env.PORT;
app.listen(PORT,'0.0.0.0');
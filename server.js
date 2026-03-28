const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

let usuarios = [{ user: "admin", senha: "123" }];
let produtos = [];
let vendas = [];

app.post('/login',(req,res)=>{
  const {user,senha}=req.body;
  const ok = usuarios.find(u=>u.user===user && u.senha===senha);
  if(ok) res.json({ok:true});
  else res.status(401).json({ok:false});
});

app.post('/produto',(req,res)=>{
  produtos.push(req.body);
  res.json({ok:true});
});

app.get('/produtos',(req,res)=>{
  res.json(produtos);
});

app.post('/venda',(req,res)=>{
  vendas.push(req.body);
  res.json({ok:true});
});

app.use(express.static(__dirname));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));

const PORT = process.env.PORT;
app.listen(PORT,'0.0.0.0');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// USUÁRIOS
let usuarios = [{ user: "admin", senha: "123" }];

// PRODUTOS
let produtos = [];

// VENDAS
let vendas = [];

// CADASTRO FUNCIONARIO
app.post('/cadastrar', (req,res)=>{
  const {user,senha}=req.body;
  if(usuarios.find(u=>u.user===user))
    return res.status(400).json({msg:"Já existe"});
  usuarios.push({user,senha});
  res.json({ok:true});
});

// LOGIN
app.post('/login',(req,res)=>{
  const {user,senha}=req.body;
  if(usuarios.find(u=>u.user===user&&u.senha===senha))
    res.json({ok:true});
  else res.status(401).json({ok:false});
});

// CADASTRAR PRODUTO
app.post('/produto',(req,res)=>{
  produtos.push(req.body);
  res.json({ok:true});
});

// LISTAR PRODUTO
app.get('/produtos',(req,res)=>{
  res.json(produtos);
});

// REGISTRAR VENDA
app.post('/venda',(req,res)=>{
  vendas.push({...req.body, data:new Date()});
  res.json({ok:true});
});

// RELATORIO
app.get('/relatorio',(req,res)=>{
  const hoje=new Date().toDateString();
  const mes=new Date().getMonth();

  let dia= vendas.filter(v=> new Date(v.data).toDateString()===hoje);
  let mesV= vendas.filter(v=> new Date(v.data).getMonth()===mes);

  let ranking={};

  vendas.forEach(v=>{
    v.itens.forEach(i=>{
      ranking[i.nome]=(ranking[i.nome]||0)+i.qtd;
    });
  });

  res.json({dia,mes:mesV,ranking});
});

app.use(express.static(__dirname));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));

const PORT=process.env.PORT;
app.listen(PORT,'0.0.0.0');
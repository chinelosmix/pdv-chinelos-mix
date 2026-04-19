const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

// 🔥 SERVIR SEU SISTEMA (index.html)
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

// ================= PRODUTOS =================

// LISTAR
app.get('/produtos',(req,res)=> res.json(produtos));

// CADASTRAR
app.post('/produtos',(req,res)=>{
  produtos.push(req.body);
  res.json({ok:true});
});

// 🔥 EDITAR PRODUTO
app.put('/produtos/:codigo',(req,res)=>{
  let i = produtos.findIndex(p=>p.codigo==req.params.codigo);
  if(i>=0){
    produtos[i] = req.body;
    res.json({ok:true});
  }else{
    res.status(404).json({erro:true});
  }
});

// 🔥 EXCLUIR PRODUTO
app.delete('/produtos/:codigo',(req,res)=>{
  produtos = produtos.filter(p=>p.codigo!=req.params.codigo);
  res.json({ok:true});
});

// ================= VENDAS =================

app.post('/venda',(req,res)=>{
  vendas.push(req.body);
  res.json({ok:true});
});

app.get('/relatorio',(req,res)=> res.json(vendas));

// ================= FUNCIONARIOS =================

app.post('/funcionario',(req,res)=>{
  funcionarios.push(req.body);
  res.json({ok:true});
});

// 🔥 PORTA CORRETA PRA RAILWAY
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));

const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// 📦 ARQUIVOS
const DB_PROD = 'produtos.json';
const DB_VEND = 'vendas.json';
const DB_FUNC = 'funcionarios.json';

// FUNÇÃO LER
function ler(file){
try{
return JSON.parse(fs.readFileSync(file))
}catch{
return []
}
}

// FUNÇÃO SALVAR
function salvar(file,dados){
fs.writeFileSync(file, JSON.stringify(dados,null,2))
}

// ================= PRODUTOS =================

app.get('/produtos',(req,res)=>{
res.json(ler(DB_PROD))
})

app.post('/produtos',(req,res)=>{
let lista = ler(DB_PROD)
lista.push(req.body)
salvar(DB_PROD,lista)
res.json({ok:true})
})

app.put('/produtos/:codigo',(req,res)=>{
let lista = ler(DB_PROD)

let i = lista.findIndex(p=>p.codigo==req.params.codigo)
if(i>=0){
lista[i]=req.body
salvar(DB_PROD,lista)
res.json({ok:true})
}else{
res.status(404).json({erro:true})
}
})

app.delete('/produtos/:codigo',(req,res)=>{
let lista = ler(DB_PROD)
lista = lista.filter(p=>p.codigo!=req.params.codigo)
salvar(DB_PROD,lista)
res.json({ok:true})
})

// ================= VENDAS =================

app.post('/venda',(req,res)=>{
let lista = ler(DB_VEND)
lista.push(req.body)
salvar(DB_VEND,lista)
res.json({ok:true})
})

app.get('/relatorio',(req,res)=>{
res.json(ler(DB_VEND))
})

// ================= FUNCIONARIOS =================

app.post('/funcionario',(req,res)=>{
let lista = ler(DB_FUNC)
lista.push(req.body)
salvar(DB_FUNC,lista)
res.json({ok:true})
})

app.post('/login',(req,res)=>{
let lista = ler(DB_FUNC)
const {nome,senha}=req.body

let f = lista.find(x=>x.nome===nome && x.senha===senha)

if(!f) return res.status(401).json({erro:true})

res.json(f)
})

// ================= SERVIR HTML =================

const path = require('path');
app.use(express.static(__dirname));

app.get('/', (req,res)=>{
res.sendFile(path.join(__dirname,'index.html'));
});

// ================= PORTA =================

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Servidor rodando"));

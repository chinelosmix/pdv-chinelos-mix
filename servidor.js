const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('publico'));

let usuarios = [{ usuario: "admin", senha: "123" }];

app.post('/login',(req,res)=>{
const {usuario,senha}=req.body;
const ok = usuarios.find(u=>u.usuario===usuario && u.senha===senha);
res.json({ok});
});

app.post('/venda',(req,res)=>{
console.log("Venda:", req.body);
res.sendStatus(200);
});

app.listen(3000,()=>console.log("Rodando"));

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

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

// PRODUTOS
app.post('/produto',(req,res)=>{
  produtos.push(req.body);
  res.json({ok:true});
});

app.get('/produtos',(req,res)=>res.json(produtos));

app.post('/excluir-produto',(req,res)=>{
  produtos = produtos.filter(p=>p.nome!==req.body.nome);
  res.json({ok:true});
});

// VENDA + ESTOQUE
app.post('/venda',(req,res)=>{
  let venda={...req.body,data:new Date()};

  venda.itens.forEach(i=>{
    let p=produtos.find(x=>x.nome===i.nome);
    if(p) p.estoque-=i.qtd;
  });

  vendas.push(venda);
  res.json({ok:true});
});

// RELATORIO
app.get('/relatorio',(req,res)=>{
  const hoje=new Date().toDateString();
  let dia=vendas.filter(v=>new Date(v.data).toDateString()===hoje);

  let ranking={};
  vendas.forEach(v=>{
    v.itens.forEach(i=>{
      ranking[i.nome]=(ranking[i.nome]||0)+i.qtd;
    });
  });

  res.json({dia,ranking});
});

// NF
app.post('/nf', async (req,res)=>{

  const token="COLE_SEU_TOKEN";

  try{
    const response=await fetch('https://api.focusnfe.com.br/v2/nfe',{
      method:'POST',
      headers:{
        'Authorization':'Basic '+Buffer.from(token+":").toString('base64'),
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        natureza_operacao:"Venda",
        cliente:{nome:"Consumidor Final",indicador_ie:9},
        itens:req.body.itens.map(i=>({
          descricao:i.nome,
          quantidade:i.qtd,
          valor_unitario:i.valor,
          codigo_ncm:"6109.10.00",
          cfop:"5102"
        }))
      })
    });

    res.json(await response.json());

  }catch(e){
    res.status(500).json({erro:e.message});
  }
});

app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.use(express.static(__dirname));

app.listen(3000);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Servidor rodando na porta " + PORT);
});

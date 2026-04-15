const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('publico'));

// LOGIN
app.post('/login',(req,res)=>{
    const {usuario, senha} = req.body;

    if(usuario === "admin" && senha === "123"){
        res.json({ok:true});
    } else {
        res.json({ok:false});
    }
});

// VENDA
app.post('/venda',(req,res)=>{
    console.log("Venda recebida:", req.body);
    res.sendStatus(200);
});

// PORTA DO RAILWAY (IMPORTANTE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// DADOS
let usuarios = [{ user: "admin", senha: "123" }];
let produtos = [];
let vendas = [];

// LOGIN
app.post('/login', (req, res) => {
  const { user, senha } = req.body;

  const ok = usuarios.find(u => u.user === user && u.senha === senha);

  if (ok) res.json({ ok: true });
  else res.status(401).json({ ok: false });
});

// CADASTRO FUNC
app.post('/cadastrar', (req, res) => {
  usuarios.push(req.body);
  res.json({ ok: true });
});

// PRODUTO
app.post('/produto', (req, res) => {
  produtos.push(req.body);
  res.json({ ok: true });
});

app.get('/produtos', (req, res) => res.json(produtos));

app.post('/excluir-produto', (req, res) => {
  produtos = produtos.filter(p => p.nome !== req.body.nome);
  res.json({ ok: true });
});

// VENDA + ESTOQUE
app.post('/venda', (req, res) => {
  let venda = { ...req.body, data: new Date() };

  venda.itens.forEach(i => {
    let p = produtos.find(x => x.nome === i.nome);
    if (p) p.estoque -= i.qtd;
  });

  vendas.push(venda);
  res.json({ ok: true });
});

// RELATORIO
app.get('/relatorio', (req, res) => {
  const hoje = new Date().toDateString();
  const mesAtual = new Date().getMonth();

  let dia = vendas.filter(v => new Date(v.data).toDateString() === hoje);
  let mes = vendas.filter(v => new Date(v.data).getMonth() === mesAtual);

  let ranking = {};
  vendas.forEach(v => {
    v.itens.forEach(i => {
      ranking[i.nome] = (ranking[i.nome] || 0) + i.qtd;
    });
  });

  res.json({ dia, mes, ranking });
});

// NF-e (FOCUS)
app.post('/nf', async (req, res) => {

  const token = "COLE_SEU_TOKEN_AQUI";

  try {
    const response = await fetch('https://api.focusnfe.com.br/v2/nfe', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(token + ":").toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        natureza_operacao: "Venda de mercadoria",
        finalidade_emissao: "1",
        cliente: { nome: "Consumidor Final", indicador_ie: 9 },
        itens: req.body.itens.map(i => ({
          descricao: i.nome,
          quantidade: i.qtd,
          valor_unitario: i.valor,
          codigo_ncm: "6109.10.00",
          cfop: "5102",
          unidade_comercial: "UN"
        }))
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// FRONT
app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0');
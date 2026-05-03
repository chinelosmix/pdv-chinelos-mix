export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { itens, frete, freteInfo, pgto, parcelas } = req.body;
    const isPix = pgto === 'pix';
    const numParcelas = Number(parcelas) || 1;

    const mpItems = itens.map(i => ({
      title: i.nome + ' Tam ' + i.tam,
      quantity: Number(i.qtd),
      unit_price: Number(i.preco),
      currency_id: 'BRL'
    }));

    if (frete > 0) mpItems.push({
      title: 'Frete',
      quantity: 1,
      unit_price: Number(frete),
      currency_id: 'BRL'
    });

    const payload = {
      items: mpItems,
      payment_methods: {
        excluded_payment_types: isPix
          ? [{id:'credit_card'},{id:'debit_card'},{id:'ticket'}]
          : [{id:'ticket'}],
        installments: numParcelas
      },
      back_urls: {
        success: 'https://pdv-chinelos-mix.vercel.app/loja.html?pg=ok',
        failure: 'https://pdv-chinelos-mix.vercel.app/loja.html?pg=falha',
        pending: 'https://pdv-chinelos-mix.vercel.app/loja.html?pg=pendente'
      },
      auto_return: 'approved',
      statement_descriptor: 'CHINELOS MIX',
      external_reference: 'pedido-' + Date.now()
    };

    const TOKEN = process.env.MP_TOKEN;
    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
      body: JSON.stringify(payload)
    });

    const data = await r.json();
    if (data.init_point) return res.status(200).json({ init_point: data.init_point });
    return res.status(500).json({ erro: 'MP erro', detalhe: data });

  } catch(e) {
    return res.status(500).json({ erro: e.message });
  }
}

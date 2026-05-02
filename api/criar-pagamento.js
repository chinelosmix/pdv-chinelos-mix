export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { itens, frete, freteInfo, modoEntrega, pgto, parcelas } = req.body;

    const mpItems = itens.map(i => ({
      title: String(i.nome) + ' Tam ' + String(i.tam),
      quantity: Number(i.qtd),
      unit_price: Number(i.preco),
      currency_id: 'BRL'
    }));

    if (frete > 0) {
      mpItems.push({
        title: 'Frete',
        quantity: 1,
        unit_price: Number(frete),
        currency_id: 'BRL'
      });
    }

    const isPix = pgto === 'pix';
    const numParcelas = Number(parcelas) || 1;
    const host = req.headers.host || 'pdv-chinelos-mix.vercel.app';
    const baseUrl = 'https://' + host;

    const prefPayload = {
      items: mpItems,
      payment_methods: {
        excluded_payment_types: isPix
          ? [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }]
          : [{ id: 'ticket' }],
        installments: numParcelas
      },
      back_urls: {
        success: baseUrl + '/?pagamento=sucesso',
        failure: baseUrl + '/?pagamento=falha',
        pending: baseUrl + '/?pagamento=pendente'
      },
      auto_return: 'approved',
      statement_descriptor: 'CHINELOS MIX',
      external_reference: 'pedido-' + Date.now()
    };

    const TOKEN = process.env.MP_TOKEN;

    if (!TOKEN) {
      return res.status(500).json({ erro: 'Token MP não configurado' });
    }

    const mpResp = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      },
      body: JSON.stringify(prefPayload)
    });

    const mpData = await mpResp.json();

    if (mpData.init_point) {
      return res.status(200).json({ init_point: mpData.init_point });
    } else {
      return res.status(500).json({ erro: 'MP não retornou link', detalhe: mpData });
    }

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

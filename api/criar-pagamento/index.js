export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = req.body;
    const itens = body.itens || [];
    const frete = Number(body.frete) || 0;
    const freteInfo = body.freteInfo || {};
    const pgto = body.pgto || 'pix';
    const parcelas = Number(body.parcelas) || 1;
    const isPix = pgto === 'pix';

    const mpItems = itens.map(i => ({
      title: i.nome + ' Tam ' + i.tam,
      quantity: Number(i.qtd),
      unit_price: Number(i.preco),
      currency_id: 'BRL'
    }));

    if (frete > 0) {
      mpItems.push({
        title: 'Frete - ' + (freteInfo.prazo || 'Entrega'),
        quantity: 1,
        unit_price: frete,
        currency_id: 'BRL'
      });
    }

    const baseUrl = 'https://pdv-chinelos-mix.vercel.app';

    const prefPayload = {
      items: mpItems,
      payment_methods: {
        excluded_payment_types: isPix
          ? [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }]
          : [{ id: 'ticket' }],
        installments: parcelas
      },
      back_urls: {
        success: baseUrl + '/loja.html?pagamento=sucesso',
        failure: baseUrl + '/loja.html?pagamento=falha',
        pending: baseUrl + '/loja.html?pagamento=pendente'
      },
      auto_return: 'approved',
      statement_descriptor: 'CHINELOS MIX',
      external_reference: 'pedido-' + Date.now(),
      notification_url: baseUrl + '/api/criar-pagamento'
    };

    const TOKEN = process.env.MP_TOKEN;
    if (!TOKEN) {
      return res.status(500).json({ erro: 'MP_TOKEN não configurado nas variáveis de ambiente' });
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
    console.log('MP resposta:', JSON.stringify(mpData).slice(0, 500));

    if (mpData.init_point) {
      return res.status(200).json({
        ok: true,
        init_point: mpData.init_point,
        sandbox_init_point: mpData.sandbox_init_point
      });
    }

    return res.status(500).json({
      erro: 'Mercado Pago não retornou link',
      detalhe: mpData
    });

  } catch (err) {
    console.error('Erro:', err.message);
    return res.status(500).json({ erro: err.message });
  }
}

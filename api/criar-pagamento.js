export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  try {
    const { itens, frete, freteInfo, modoEntrega, pgto, parcelas } = req.body;
    if (!itens || itens.length === 0) return res.status(400).json({ erro: 'Carrinho vazio' });

    const mpItems = itens.map(i => ({
      title: `${i.nome} — Tam ${i.tam}`,
      quantity: Number(i.qtd),
      unit_price: Number(i.preco),
      currency_id: 'BRL',
      category_id: 'fashion'
    }));

    if (frete > 0) mpItems.push({
      title: `Frete — ${freteInfo?.prazo || 'Entrega'}`,
      quantity: 1, unit_price: Number(frete), currency_id: 'BRL'
    });

    const isPix = pgto === 'pix';
    const numParcelas = Number(parcelas) || 1;
    const baseUrl = `https://${req.headers.host}`;

    const prefPayload = {
      items: mpItems,
      payment_methods: {
        excluded_payment_types: isPix
          ? [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }]
          : [{ id: 'ticket' }, { id: 'pix' }],
        installments: numParcelas,
        default_installments: numParcelas
      },
      back_urls: {
        success: `${baseUrl}/?status=sucesso`,
        failure: `${baseUrl}/?status=falha`,
        pending: `${baseUrl}/?status=pendente`
      },
      auto_return: 'approved',
      statement_descriptor: 'CHINELOS MIX',
      external_reference: `pedido-${Date.now()}`
    };

    const TOKEN = process.env.MP_TOKEN;
    const resp = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` },
      body: JSON.stringify(prefPayload)
    });

    const data = await resp.json();
    if (!resp.ok || !data.init_point) throw new Error('MP erro');
    return res.status(200).json({ init_point: data.init_point, id: data.id });

  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno', msg: err.message });
  }
}

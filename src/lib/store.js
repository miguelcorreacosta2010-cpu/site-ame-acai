const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };


export const STATUS_ORDER = ['pendente', 'em_preparo', 'saiu_entrega', 'concluido'];

export const STATUS_LABELS = {
  pendente: 'Pendente',
  em_preparo: 'Em preparo',
  saiu_entrega: 'Saiu para entrega',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export const STATUS_TONES = {
  pendente: 'border-gold-30 bg-gold-12 text-gold-soft',
  em_preparo: 'border-[hsl(281_57%_42%)] bg-[hsl(281_57%_30%/.5)] text-[hsl(46_72%_80%)]',
  saiu_entrega: 'border-[hsl(210_60%_45%)] bg-[hsl(210_60%_35%/.4)] text-[hsl(210_80%_85%)]',
  concluido: 'border-[hsl(150_45%_35%)] bg-[hsl(150_45%_28%/.4)] text-[hsl(150_60%_80%)]',
  cancelado: 'border-[hsl(0_50%_42%)] bg-[hsl(0_50%_32%/.35)] text-[hsl(0_70%_85%)]',
};

export const PAYMENT_LABELS = {
  pix: 'Pix',
  card: 'Cartão de Crédito/Débito',
  cash: 'Dinheiro',
};

export const currency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

export const onlyDigits = (value) => String(value || '').replace(/\D/g, '');

export function whatsappNumber(phone) {
  const digits = onlyDigits(phone);
  if (!digits) return '';
  return digits.startsWith('55') ? digits : `55${digits}`;
}

export function whatsappLink(phone, message) {
  return `https://wa.me/${whatsappNumber(phone)}?text=${encodeURIComponent(message)}`;
}

export function deliveryFeeFor(settings, orderType, neighborhood) {
  if (orderType !== 'delivery') return 0;
  const fixed = Number(settings?.fixed_delivery_fee || 0);
  if (settings?.delivery_fee_mode === 'neighborhood') {
    const match = (settings?.delivery_fees || []).find((item) => item.neighborhood === neighborhood);
    return match ? Number(match.fee || 0) : fixed;
  }
  return fixed;
}

export function cartTotals(items, settings, orderType, neighborhood) {
  const subtotal = (items || []).reduce((sum, item) => sum + Number(item.line_total || 0), 0);
  const deliveryFee = deliveryFeeFor(settings, orderType, neighborhood);
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}

export const addonsLabel = (item) =>
  (item.addons || []).map((addon) =>
    Number(addon.price) > 0 ? `${addon.name} (+${currency(addon.price)})` : addon.name
  );

export function buildOrderMessage(order, settings) {
  const lines = [];
  lines.push(`*NOVO PEDIDO — ${settings?.store_name || 'AME Açaí & Pastéis'}*`);
  if (order.order_code) lines.push(`Pedido: ${order.order_code}`);
  lines.push(`Cliente: ${order.customer_name}`);
  lines.push(`WhatsApp: ${order.customer_phone}`);
  lines.push(`Tipo: ${order.order_type === 'pickup' ? 'Retirada no local' : 'Entrega em domicílio'}`);
  lines.push('');
  lines.push('*ITENS*');
  (order.items || []).forEach((item) => {
    lines.push(`${item.quantity}x ${item.name} — ${currency(item.line_total)}`);
    const addons = addonsLabel(item);
    if (addons.length) lines.push(`   + ${addons.join(', ')}`);
    if (item.observation) lines.push(`   Obs: ${item.observation}`);
  });
  lines.push('');
  lines.push(`Subtotal: ${currency(order.subtotal)}`);
  if (order.order_type === 'delivery') lines.push(`Taxa de entrega: ${currency(order.delivery_fee)}`);
  lines.push(`*Total: ${currency(order.total)}*`);
  lines.push('');
  if (order.order_type === 'delivery') {
    lines.push('*Endereço de entrega*');
    lines.push(`${order.address_street}, ${order.address_number} — ${order.address_neighborhood}`);
    if (order.address_complement) lines.push(`Complemento: ${order.address_complement}`);
    if (order.address_reference) lines.push(`Ponto de referência: ${order.address_reference}`);
  } else {
    lines.push('*Retirada no local*');
    if (settings?.pickup_address) lines.push(settings.pickup_address);
  }
  lines.push('');
  lines.push('*Pagamento*');
  lines.push(
    order.payment_method === 'cash' && order.change_for
      ? `Dinheiro — troco para ${order.change_for}`
      : PAYMENT_LABELS[order.payment_method] || order.payment_method
  );
  if (order.notes) {
    lines.push('');
    lines.push(`Observações: ${order.notes}`);
  }
  lines.push('');
  lines.push('Pedido feito pelo cardápio digital 🍧♡');
  return lines.join('\n');
}

export function statusMessage(status, order, settings) {
  const firstName = (order.customer_name || '').split(' ')[0] || 'tudo bem';
  const store = settings?.store_name || 'AME Açaí & Pastéis';
  const messages = {
    pendente: `Oi, ${firstName}! Recebemos seu pedido ${order.order_code} na ${store} e já vamos começar ♡`,
    em_preparo: `Oi, ${firstName}! Seu pedido ${order.order_code} já está em preparo na ${store} 👩🍳`,
    saiu_entrega: `Oi, ${firstName}! Seu pedido ${order.order_code} saiu para entrega. Já, já chega aí! 🛵`,
    concluido: `Oi, ${firstName}! Seu pedido ${order.order_code} foi concluído. Obrigado pela preferência ♡`,
    cancelado: `Oi, ${firstName}! Seu pedido ${order.order_code} foi cancelado. Qualquer dúvida, é só chamar.`,
  };
  return messages[status] || `Atualização do seu pedido ${order.order_code}: ${STATUS_LABELS[status]}`;
}

export function nextStatus(status) {
  const index = STATUS_ORDER.indexOf(status);
  if (index === -1 || index === STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[index + 1];
}

async function nextOrderCode() {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const count = await db.entities.Order.count({ created_date: { $gte: start.toISOString() } });
    return `#${String(count + 1).padStart(3, '0')}`;
  } catch (error) {
    return `#${String(Math.floor(Math.random() * 900) + 100)}`;
  }
}

export async function submitOrder(payload) {
  const orderCode = await nextOrderCode();
  return db.entities.Order.create({ ...payload, order_code: orderCode, status: 'pendente' });
}
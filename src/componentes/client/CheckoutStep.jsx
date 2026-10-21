import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Banknote, Bike, CreditCard, QrCode, Store, ArrowLeft } from 'lucide-react';
import { cartTotals, currency, submitOrder, whatsappLink, buildOrderMessage } from '@/lib/store';

const OTHER_NEIGHBORHOOD = '__other__';

export default function CheckoutStep({
  settings,
  items,
  orderType,
  setOrderType,
  neighborhood,
  setNeighborhood,
  onBack,
  onCreated,
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [reference, setReference] = useState('');
  const [otherNeighborhood, setOtherNeighborhood] = useState('');
  const [payment, setPayment] = useState('pix');
  const [changeFor, setChangeFor] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const feeList = settings?.delivery_fees || [];
  const usesFeeList = settings?.delivery_fee_mode === 'neighborhood' && feeList.length > 0;
  const totals = cartTotals(items, settings, orderType, neighborhood);
  const neighborhoodValue = neighborhood === OTHER_NEIGHBORHOOD ? otherNeighborhood : neighborhood;

  const paymentOptions = [
    { id: 'pix', label: 'Pix', icon: QrCode },
    { id: 'card', label: 'Cartão de Crédito/Débito', icon: CreditCard },
    { id: 'cash', label: 'Dinheiro', icon: Banknote },
  ];

  const handleSubmit = async () => {
    if (!name.trim()) return setError('Informe o seu nome.');
    if (!phone.trim()) return setError('Informe o seu telefone/WhatsApp.');
    if (orderType === 'delivery') {
      if (!street.trim() || !number.trim()) return setError('Informe a rua e o número para a entrega.');
      if (!neighborhoodValue.trim()) return setError('Informe o bairro da entrega.');
    }

    setError('');
    setSending(true);
    const waWindow = window.open('', '_blank');

    try {
      const order = await submitOrder({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        order_type: orderType,
        address_street: orderType === 'delivery' ? street.trim() : '',
        address_number: orderType === 'delivery' ? number.trim() : '',
        address_neighborhood: orderType === 'delivery' ? neighborhoodValue.trim() : '',
        address_complement: orderType === 'delivery' ? complement.trim() : '',
        address_reference: orderType === 'delivery' ? reference.trim() : '',
        items,
        subtotal: totals.subtotal,
        delivery_fee: totals.deliveryFee,
        total: totals.total,
        payment_method: payment,
        change_for: payment === 'cash' ? changeFor.trim() : '',
        notes: notes.trim(),
      });

      const link = whatsappLink(settings?.whatsapp, buildOrderMessage(order, settings));
      if (waWindow) waWindow.location.href = link;
      onCreated(order, link);
    } catch (submitError) {
      if (waWindow) waWindow.close();
      setError('Não conseguimos enviar seu pedido agora. Tente novamente em instantes.');
    }

    setSending(false);
  };

  return (
    <>
      <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-gold-soft transition hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar ao carrinho
        </button>

        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-gold-15 p-1">
          {[
            { id: 'delivery', label: 'Entrega', icon: Bike },
            { id: 'pickup', label: 'Retirada', icon: Store },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setOrderType(id)}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition ${
                orderType === id ? 'bg-gold text-[hsl(285_74%_8%)]' : 'text-[hsl(273_20%_78%)] hover:bg-gold-12'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="customer-name" className="text-[10px] uppercase tracking-[0.2em] text-gold">
              Seu nome
            </Label>
            <Input
              id="customer-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Como podemos te chamar?"
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>

          <div>
            <Label htmlFor="customer-phone" className="text-[10px] uppercase tracking-[0.2em] text-gold">
              Telefone / WhatsApp
            </Label>
            <Input
              id="customer-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(51) 99999-9999"
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>
        </div>

        {orderType === 'delivery' ? (
          <div className="mt-6 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">Endereço de entrega</h3>
            <div className="grid grid-cols-[1.6fr_1fr] gap-3">
              <Input
                value={street}
                onChange={(event) => setStreet(event.target.value)}
                placeholder="Rua"
                className="rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
              />
              <Input
                value={number}
                onChange={(event) => setNumber(event.target.value)}
                placeholder="Número"
                className="rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
              />
            </div>

            {usesFeeList ? (
              <div>
                <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Bairro</Label>
                <select
                  value={neighborhood}
                  onChange={(event) => setNeighborhood(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gold-15 bg-[hsl(281_32%_14%)] px-3 py-2 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="">Selecione o bairro</option>
                  {feeList.map((fee) => (
                    <option key={fee.neighborhood} value={fee.neighborhood}>
                      {fee.neighborhood} — {currency(fee.fee)}
                    </option>
                  ))}
                  <option value={OTHER_NEIGHBORHOOD}>Outro bairro</option>
                </select>
              </div>
            ) : (
              <Input
                value={neighborhood}
                onChange={(event) => setNeighborhood(event.target.value)}
                placeholder="Bairro"
                className="rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
              />
            )}

            {usesFeeList && neighborhood === OTHER_NEIGHBORHOOD && (
              <Input
                value={otherNeighborhood}
                onChange={(event) => setOtherNeighborhood(event.target.value)}
                placeholder="Qual bairro?"
                className="rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
              />
            )}

            <Input
              value={complement}
              onChange={(event) => setComplement(event.target.value)}
              placeholder="Complemento (apto, bloco, casa)"
              className="rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
            <Input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="Ponto de referência"
              className="rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-gold-15 velvet-card p-4 text-sm text-[hsl(273_20%_78%)]">
            <p className="flex items-center gap-2 font-medium text-[hsl(var(--foreground))]">
              <Store className="h-4 w-4 text-gold" />
              Retirada no local
            </p>
            <p className="mt-2">
              {settings?.pickup_address || 'A loja confirma o endereço de retirada pelo WhatsApp ♡'}
            </p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">Forma de pagamento</h3>
          <div className="mt-3 space-y-2">
            {paymentOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPayment(id)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  payment === id ? 'border-gold bg-gold-12 text-gold-soft' : 'border-gold-15 hover:border-gold-30'
                }`}
              >
                <Icon className="h-4 w-4 text-gold" />
                {label}
              </button>
            ))}
          </div>

          {payment === 'pix' && settings?.pix_key && (
            <p className="mt-3 rounded-xl border border-gold-15 bg-gold-12 px-3 py-2 text-xs text-gold-soft">
              Chave Pix da loja: {settings.pix_key}
            </p>
          )}

          {payment === 'cash' && (
            <Input
              value={changeFor}
              onChange={(event) => setChangeFor(event.target.value)}
              placeholder="Precisa de troco para quanto? (ex: R$ 100,00)"
              className="mt-3 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">Observações do pedido</h3>
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Alguma preferência ou informação extra?"
            className="mt-3 min-h-[70px] rounded-2xl border-gold-15 bg-[hsl(281_32%_14%)] text-sm placeholder:text-[hsl(273_20%_58%)] focus-visible:ring-gold"
          />
        </div>
      </div>

      <div className="border-t border-gold-15 px-6 py-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.22em] text-gold">Total</span>
          <span className="font-display text-2xl text-gold">{currency(totals.total)}</span>
        </div>
        {error && (
          <p className="mt-3 rounded-xl border border-[hsl(0_50%_42%)] bg-[hsl(0_50%_32%/.25)] px-3 py-2 text-xs text-[hsl(0_70%_88%)]">
            {error}
          </p>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={sending}
          className="mt-4 w-full rounded-full bg-gold py-6 text-sm font-semibold uppercase tracking-[0.12em] text-[hsl(285_74%_8%)] transition hover:bg-gold-soft hover:glow-gold disabled:opacity-60"
        >
          {sending ? 'Enviando pedido...' : 'Enviar pedido no WhatsApp'}
        </Button>
        <p className="mt-3 text-center text-[11px] text-[hsl(273_20%_68%)]">
          Seu pedido abre no WhatsApp da loja e fica salvo no painel do gerente.
        </p>
      </div>
    </>
  );
}
import { Bike, Clock, MessageCircle, Store, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PAYMENT_LABELS,
  STATUS_LABELS,
  STATUS_TONES,
  addonsLabel,
  currency,
  nextStatus,
  whatsappLink,
} from '@/lib/store';

function timeAgo(value) {
  if (!value) return '';
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return 'agora mesmo';
  if (minutes < 60) return `${minutes} min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h atrás`;
  return `${Math.floor(hours / 24)} d atrás`;
}

export default function OrderCard({ order, settings, onChangeStatus, onNotify }) {
  const advance = nextStatus(order.status);

  return (
    <article className="rounded-2xl border border-gold-15 velvet-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-base">{order.order_code || 'Pedido'}</p>
          <p className="mt-0.5 text-sm text-[hsl(var(--foreground))]">{order.customer_name}</p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${
            STATUS_TONES[order.status] || STATUS_TONES.pendente
          }`}
        >
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[hsl(273_20%_68%)]">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeAgo(order.created_date)}
        </span>
        <span className="flex items-center gap-1">
          {order.order_type === 'pickup' ? <Store className="h-3 w-3" /> : <Bike className="h-3 w-3" />}
          {order.order_type === 'pickup' ? 'Retirada' : 'Entrega'}
        </span>
      </div>

      <ul className="mt-3 space-y-1.5 border-t border-gold-15 pt-3 text-xs text-[hsl(273_20%_80%)]">
        {(order.items || []).map((item, index) => (
          <li key={`${order.id}-${index}`}>
            <span className="font-medium text-[hsl(var(--foreground))]">
              {item.quantity}x {item.name}
            </span>
            {item.addons?.length > 0 && (
              <span className="block text-[11px] text-gold-soft">+ {addonsLabel(item).join(' · ')}</span>
            )}
            {item.observation && (
              <span className="block text-[11px] italic text-[hsl(273_20%_68%)]">{item.observation}</span>
            )}
          </li>
        ))}
      </ul>

      {(order.address_street || order.notes) && (
        <div className="mt-3 space-y-1 border-t border-gold-15 pt-3 text-[11px] text-[hsl(273_20%_72%)]">
          {order.order_type === 'delivery' && order.address_street && (
            <p>
              {order.address_street}, {order.address_number} — {order.address_neighborhood}
              {order.address_complement ? ` · ${order.address_complement}` : ''}
              {order.address_reference ? ` · Ref: ${order.address_reference}` : ''}
            </p>
          )}
          {order.notes && <p className="italic">Obs: {order.notes}</p>}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-gold-15 pt-3">
        <span className="text-[11px] text-[hsl(273_20%_72%)]">
          {PAYMENT_LABELS[order.payment_method] || order.payment_method}
          {order.change_for ? ` · troco ${order.change_for}` : ''}
        </span>
        <span className="font-display text-lg text-gold">{currency(order.total)}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {advance && (
          <Button
            type="button"
            size="sm"
            onClick={() => onChangeStatus(advance)}
            className="rounded-full bg-gold px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[hsl(285_74%_8%)] hover:bg-gold-soft"
          >
            {STATUS_LABELS[advance]}
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onNotify}
          className="rounded-full border-gold-30 bg-transparent text-[11px] uppercase tracking-[0.1em] text-gold-soft hover:bg-gold-12 hover:text-gold-soft"
        >
          <MessageCircle className="mr-1 h-3 w-3" />
          WhatsApp
        </Button>
        {order.status !== 'cancelado' && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onChangeStatus('cancelado')}
            className="rounded-full text-[11px] uppercase tracking-[0.1em] text-[hsl(273_20%_70%)] hover:bg-[hsl(0_50%_32%/.3)] hover:text-[hsl(0_70%_85%)]"
          >
            <X className="mr-1 h-3 w-3" />
            Cancelar
          </Button>
        )}
        <a
          href={whatsappLink(order.customer_phone, `Olá, ${order.customer_name}!`)}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-[11px] text-[hsl(273_20%_64%)] underline-offset-2 hover:text-gold-soft hover:underline"
        >
          {order.customer_phone}
        </a>
      </div>
    </article>
  );
}
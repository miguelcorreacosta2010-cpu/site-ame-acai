import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { STATUS_LABELS, STATUS_TONES, currency } from '@/lib/store';

export default function OrderSuccessDialog({ open, onOpenChange, placedOrder, settings }) {
  const order = placedOrder?.order;
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-md rounded-3xl border-gold-15 bg-[hsl(285_74%_7%)] p-6">
        <DialogHeader className="text-left">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-30 bg-gold-12 text-gold">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <DialogTitle className="mt-2 font-display text-2xl">Pedido enviado ♡</DialogTitle>
          <DialogDescription className="text-sm text-[hsl(273_20%_76%)]">
            {settings?.store_name || 'A loja'} recebeu seu pedido e já vai começar o preparo. Acompanhe as
            atualizações pelo WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 rounded-2xl border border-gold-15 velvet-card p-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg">{order.order_code}</span>
            <span
              className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] ${
                STATUS_TONES[order.status] || STATUS_TONES.pendente
              }`}
            >
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-[hsl(273_20%_78%)]">
            {order.items.map((item) => (
              <li key={`${item.product_id}-${item.name}`} className="flex justify-between gap-3">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>{currency(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-gold-15 pt-3 text-sm">
            {order.order_type === 'delivery' && (
              <div className="flex justify-between text-[hsl(273_20%_76%)]">
                <span>Taxa de entrega</span>
                <span>{currency(order.delivery_fee)}</span>
              </div>
            )}
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Total</span>
              <span className="font-display text-xl text-gold">{currency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Button
            asChild
            className="w-full rounded-full bg-gold py-6 text-sm font-semibold text-[hsl(285_74%_8%)] transition hover:bg-gold-soft hover:glow-gold"
          >
            <a href={placedOrder.link} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Abrir conversa no WhatsApp
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full border-gold-30 bg-transparent text-xs uppercase tracking-[0.14em] text-gold-soft hover:bg-gold-12 hover:text-gold-soft"
          >
            Fazer outro pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
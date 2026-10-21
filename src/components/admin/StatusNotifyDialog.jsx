import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { STATUS_LABELS, statusMessage, whatsappLink } from '@/lib/store';

export default function StatusNotifyDialog({ open, onOpenChange, order, settings }) {
  if (!order) return null;

  const message = statusMessage(order.status, order, settings);
  const link = whatsappLink(order.customer_phone, message);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-md rounded-3xl border-gold-15 bg-[hsl(285_74%_7%)] p-6">
        <DialogHeader className="text-left">
          <span className="text-[10px] uppercase tracking-[0.22em] text-gold">Avisar o cliente</span>
          <DialogTitle className="font-display text-xl">
            {order.order_code} · {STATUS_LABELS[order.status]}
          </DialogTitle>
          <DialogDescription className="text-sm text-[hsl(273_20%_76%)]">
            Envie uma mensagem no WhatsApp de {order.customer_name} avisando a mudança de status.
          </DialogDescription>
        </DialogHeader>

        <p className="mt-4 whitespace-pre-line rounded-2xl border border-gold-15 velvet-card p-4 text-sm text-[hsl(273_20%_82%)]">
          {message}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <Button
            asChild
            className="w-full rounded-full bg-gold py-6 text-sm font-semibold text-[hsl(285_74%_8%)] transition hover:bg-gold-soft hover:glow-gold"
          >
            <a href={link} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Abrir WhatsApp do cliente
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full border-gold-30 bg-transparent text-xs uppercase tracking-[0.14em] text-gold-soft hover:bg-gold-12 hover:text-gold-soft"
          >
            Agora não
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
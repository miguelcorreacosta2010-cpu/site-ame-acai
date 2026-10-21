import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus } from 'lucide-react';
import { currency } from '@/lib/store';

export default function PastelDialog({ open, onOpenChange, product, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');

  useEffect(() => {
    if (!open) return;
    setQuantity(1);
    setObservation('');
  }, [open]);

  if (!product) return null;

  const unitPrice = Number(product.price || 0);

  const handleAdd = () => {
    onAdd({
      product_id: product.id,
      name: `Pastel ${product.name}`,
      category: 'pastel',
      addons: [],
      observation: observation.trim(),
      unit_price: unitPrice,
      quantity,
      line_total: unitPrice * quantity,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-md rounded-3xl border-gold-15 bg-[hsl(285_74%_7%)] p-6">
        <DialogHeader className="text-left">
          <span className="text-[10px] uppercase tracking-[0.22em] text-gold">Pastel tamanho G</span>
          <DialogTitle className="font-display text-2xl">{product.name}</DialogTitle>
          <DialogDescription className="text-sm text-[hsl(273_20%_76%)]">
            Frito na hora. Diga a quantidade e, se quiser, deixe uma observação.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-gold-15 velvet-card px-4 py-3">
          <span className="text-sm text-[hsl(273_20%_80%)]">Quantidade</span>
          <div className="flex items-center gap-1 rounded-full border border-gold-15 px-1 py-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="h-8 w-8 rounded-full text-gold-soft hover:bg-gold-12 hover:text-gold"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((current) => current + 1)}
              className="h-8 w-8 rounded-full text-gold-soft hover:bg-gold-12 hover:text-gold"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">Observação</h3>
          <Textarea
            value={observation}
            onChange={(event) => setObservation(event.target.value)}
            placeholder="Ex: sem cebola, bem passado, cortar ao meio..."
            className="mt-3 min-h-[80px] rounded-2xl border-gold-15 bg-[hsl(281_32%_14%)] text-sm placeholder:text-[hsl(273_20%_58%)] focus-visible:ring-gold"
          />
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          className="mt-5 w-full rounded-full bg-gold py-6 text-sm font-semibold text-[hsl(285_74%_8%)] transition hover:bg-gold-soft hover:glow-gold"
        >
          Adicionar · {currency(unitPrice * quantity)}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
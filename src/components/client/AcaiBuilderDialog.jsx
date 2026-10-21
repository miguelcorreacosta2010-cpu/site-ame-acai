const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

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
import { Image } from '@/components/ui/image';
import { Check, Minus, Plus } from 'lucide-react';
import { currency } from '@/lib/store';

const TOPPINGS_IMAGE = 'https://media.db.com/images/public/6ad92b0a306dbae31eb703c2/f38b55e1e_generated_95b82251.png';

const toggleId = (list, id) => (list.includes(id) ? list.filter((value) => value !== id) : [...list, id]);

export default function AcaiBuilderDialog({ open, onOpenChange, sizes, freeAddons, paidAddons, initialSizeId, onAdd }) {
  const [sizeId, setSizeId] = useState(initialSizeId);
  const [freeSelected, setFreeSelected] = useState([]);
  const [paidSelected, setPaidSelected] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');

  useEffect(() => {
    if (!open) return;
    setSizeId(initialSizeId || sizes?.[0]?.id);
    setFreeSelected([]);
    setPaidSelected([]);
    setQuantity(1);
    setObservation('');
  }, [open, initialSizeId, sizes]);

  const size = (sizes || []).find((item) => item.id === sizeId);
  const chosenFree = (freeAddons || []).filter((item) => freeSelected.includes(item.id));
  const chosenPaid = (paidAddons || []).filter((item) => paidSelected.includes(item.id));
  const paidTotal = chosenPaid.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const unitPrice = Number(size?.price || 0) + paidTotal;

  const handleAdd = () => {
    if (!size) return;
    onAdd({
      product_id: size.id,
      name: `Açaí ${size.name}`,
      category: 'acai',
      addons: [
        ...chosenFree.map((item) => ({ name: item.name, price: 0 })),
        ...chosenPaid.map((item) => ({ name: item.name, price: Number(item.price || 0) })),
      ],
      observation: observation.trim(),
      unit_price: unitPrice,
      quantity,
      line_total: unitPrice * quantity,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl overflow-hidden rounded-3xl border-gold-15 bg-[hsl(285_74%_7%)] p-0">
        <div className="no-scrollbar max-h-[92vh] overflow-y-auto pb-32">
          <div className="relative h-36 w-full sm:h-48">
            <Image src={TOPPINGS_IMAGE} alt="Adicionais do açaí" className="h-36 w-full sm:h-48" />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(285_74%_7%)] via-[hsl(285_74%_7%/.35)] to-transparent" />
          </div>

          <div className="px-5 pt-2 sm:px-7">
            <DialogHeader className="text-left">
              <DialogTitle className="font-display text-2xl">Monte seu açaí</DialogTitle>
              <DialogDescription className="text-sm text-[hsl(273_20%_76%)]">
                Escolha o tamanho, marque os adicionais grátis e os extras que quiser.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-7">
              <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">1 · Tamanho</h3>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {(sizes || []).map((item) => {
                  const active = item.id === sizeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSizeId(item.id)}
                      className={`rounded-2xl border px-3 py-4 text-center transition ${
                        active
                          ? 'border-gold bg-gold-12 glow-gold'
                          : 'border-gold-15 hover:border-gold-30 hover:bg-gold-12'
                      }`}
                    >
                      <span className="block font-display text-base text-[hsl(var(--foreground))]">
                        {item.name.replace('Copo ', '')}
                      </span>
                      <span className="mt-1 block text-sm text-gold">{currency(item.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7">
              <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">2 · Adicionais grátis</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(freeAddons || []).map((item) => {
                  const active = freeSelected.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFreeSelected((current) => toggleId(current, item.id))}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                        active
                          ? 'border-gold bg-gold-20 text-gold-soft'
                          : 'border-gold-15 text-[hsl(273_20%_80%)] hover:border-gold-30 hover:bg-gold-12'
                      }`}
                    >
                      {active ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7">
              <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">3 · Adicionais pagos</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(paidAddons || []).map((item) => {
                  const active = paidSelected.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaidSelected((current) => toggleId(current, item.id))}
                      className={`flex items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? 'border-gold bg-gold-12 glow-gold-soft'
                          : 'border-gold-15 hover:border-gold-30 hover:bg-gold-12'
                      }`}
                    >
                      <span className="text-sm leading-snug text-[hsl(var(--foreground))]">{item.name}</span>
                      <span className="shrink-0 text-sm font-semibold text-gold">
                        {active ? <Check className="h-4 w-4" /> : `+${currency(item.price)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7">
              <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">4 · Observação</h3>
              <Textarea
                value={observation}
                onChange={(event) => setObservation(event.target.value)}
                placeholder="Ex: sem granulado, bem cremoso, pouca calda..."
                className="mt-3 min-h-[84px] rounded-2xl border-gold-15 bg-[hsl(281_32%_14%)] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(273_20%_58%)] focus-visible:ring-gold"
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-gold-15 bg-[hsl(285_74%_7%/.96)] px-5 py-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center justify-between gap-3">
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

            <Button
              type="button"
              onClick={handleAdd}
              disabled={!size}
              className="flex-1 rounded-full bg-gold px-6 text-sm font-semibold text-[hsl(285_74%_8%)] transition hover:bg-gold-soft hover:glow-gold"
            >
              Adicionar · {currency(unitPrice * quantity)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
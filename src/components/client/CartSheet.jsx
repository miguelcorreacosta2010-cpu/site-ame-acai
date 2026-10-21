import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import CheckoutStep from '@/components/client/CheckoutStep';
import { addonsLabel, cartTotals, currency } from '@/lib/store';

export default function CartSheet({
  open,
  onOpenChange,
  settings,
  cart,
  orderType,
  setOrderType,
  neighborhood,
  setNeighborhood,
  onCreated,
}) {
  const [step, setStep] = useState('items');

  useEffect(() => {
    if (open) setStep('items');
  }, [open]);

  const totals = cartTotals(cart.items, settings, orderType, neighborhood);
  const isOpen = settings?.is_open !== false;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-gold-15 bg-[hsl(285_74%_7%)] p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-gold-15 px-6 py-5 text-left">
          <SheetTitle className="font-display text-xl">
            {step === 'items' ? 'Seu pedido' : 'Entrega e pagamento'}
          </SheetTitle>
        </SheetHeader>

        {step === 'checkout' ? (
          <CheckoutStep
            settings={settings}
            items={cart.items}
            orderType={orderType}
            setOrderType={setOrderType}
            neighborhood={neighborhood}
            setNeighborhood={setNeighborhood}
            onBack={() => setStep('items')}
            onCreated={onCreated}
          />
        ) : (
          <>
            <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-15 bg-gold-12 text-gold">
                    <ShoppingBag className="h-6 w-6" />
                  </span>
                  <p className="font-display text-lg">Seu carrinho está vazio</p>
                  <p className="text-sm text-[hsl(273_20%_74%)]">
                    Escolha um açaí ou um pastel para começar ♡
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.items.map((item) => (
                    <li key={item.uid} className="rounded-2xl border border-gold-15 velvet-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-base">{item.name}</p>
                          {item.addons?.length > 0 && (
                            <p className="mt-1 text-xs leading-relaxed text-gold-soft">
                              + {addonsLabel(item).join(' · ')}
                            </p>
                          )}
                          {item.observation && (
                            <p className="mt-1 text-xs italic text-[hsl(273_20%_70%)]">{item.observation}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => cart.removeItem(item.uid)}
                          className="shrink-0 rounded-full p-2 text-[hsl(273_20%_64%)] transition hover:bg-gold-12 hover:text-gold"
                          aria-label={`Remover ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-gold-15 px-1 py-1">
                          <button
                            type="button"
                            onClick={() => cart.updateQuantity(item.uid, Number(item.quantity) - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gold-soft transition hover:bg-gold-12 hover:text-gold"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => cart.updateQuantity(item.uid, Number(item.quantity) + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gold-soft transition hover:bg-gold-12 hover:text-gold"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-display text-lg text-gold">{currency(item.line_total)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-gold-15 px-6 py-5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[hsl(273_20%_76%)]">
                  <span>Subtotal</span>
                  <span>{currency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[hsl(273_20%_76%)]">
                  <span>Taxa de entrega</span>
                  <span>{orderType === 'pickup' ? 'Retirada no local' : currency(totals.deliveryFee)}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-gold">Total</span>
                  <span className="font-display text-2xl text-gold">{currency(totals.total)}</span>
                </div>
              </div>

              {!isOpen && (
                <p className="mt-3 rounded-xl border border-[hsl(0_50%_42%)] bg-[hsl(0_50%_32%/.25)] px-3 py-2 text-xs text-[hsl(0_70%_88%)]">
                  {settings?.closed_message || 'A loja está fechada neste momento.'}
                </p>
              )}

              <Button
                type="button"
                disabled={cart.items.length === 0 || !isOpen}
                onClick={() => setStep('checkout')}
                className="mt-4 w-full rounded-full bg-gold py-6 text-sm font-semibold uppercase tracking-[0.12em] text-[hsl(285_74%_8%)] transition hover:bg-gold-soft hover:glow-gold disabled:opacity-40"
              >
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
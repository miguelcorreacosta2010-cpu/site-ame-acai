import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { currency } from '@/lib/store';

export default function StoreNav({ settings, cartCount, cartSubtotal, onOpenCart }) {
  const isOpen = settings?.is_open !== false;

  return (
    <header className="sticky top-0 z-40 border-b border-gold-15 bg-[hsl(285_74%_7%/.82)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-[hsl(285_74%_8%)]">
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base tracking-tight">AME</span>
            <span className="block text-[10px] uppercase tracking-[0.26em] text-gold">Açaí &amp; Pastéis</span>
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={`hidden items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] sm:flex ${
              isOpen ? 'border-gold-30 text-gold-soft' : 'border-[hsl(0_0%_100%/.15)] text-[hsl(273_20%_74%)]'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'animate-pulse bg-gold' : 'bg-[hsl(273_20%_60%)]'}`}
            />
            {isOpen ? 'Aberto' : 'Fechado'}
          </span>

          <Button
            onClick={onOpenCart}
            className="rounded-full bg-gold px-4 text-[hsl(285_74%_8%)] transition hover:bg-gold-soft hover:glow-gold"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="ml-2 text-sm font-semibold">{cartCount > 0 ? currency(cartSubtotal) : 'Carrinho'}</span>
            {cartCount > 0 && (
              <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(285_74%_8%)] px-1 text-[11px] font-bold text-gold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
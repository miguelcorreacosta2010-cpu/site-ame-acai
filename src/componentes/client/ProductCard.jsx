import { Image } from '@/components/ui/image';
import { Plus } from 'lucide-react';
import { currency } from '@/lib/store';

export default function ProductCard({ product, badge, hint, onSelect, disabled }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      disabled={disabled}
      className="group relative flex w-full flex-col rounded-3xl border border-gold-15 velvet-card p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-gold-30 hover:glow-gold disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:glow-gold-soft"
    >
      {product.image_url ? (
        <span className="mb-4 block h-32 w-full overflow-hidden rounded-2xl">
          <Image src={product.image_url} alt={product.name} className="h-32 w-full" />
        </span>
      ) : (
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-30 bg-gold-12 font-display text-lg text-gold">
          {badge || product.name.charAt(0)}
        </span>
      )}

      <span className="font-display text-lg leading-snug text-[hsl(var(--foreground))]">{product.name}</span>
      {product.description && (
        <span className="mt-1 text-sm leading-relaxed text-[hsl(273_20%_76%)]">{product.description}</span>
      )}
      {hint && (
        <span className="mt-3 text-[10px] uppercase tracking-[0.16em] text-gold-soft">{hint}</span>
      )}

      <span className="mt-4 flex items-center justify-between">
        <span className="font-display text-xl text-gold">{currency(product.price)}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-[hsl(285_74%_8%)] transition group-hover:scale-110">
          <Plus className="h-4 w-4" />
        </span>
      </span>
    </button>
  );
}
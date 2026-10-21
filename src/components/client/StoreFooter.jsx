import { Link } from 'react-router-dom';
import { CreditCard, Heart, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { whatsappLink } from '@/lib/store';

export default function StoreFooter({ settings, onOpenCart, cartCount }) {
  const isOpen = settings?.is_open !== false;
  const waLink = whatsappLink(settings?.whatsapp, 'Olá! Vim pelo cardápio digital ♡');

  return (
    <footer className="border-t border-gold-15 bg-[hsl(285_74%_6%/.85)]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-[hsl(285_74%_8%)]">
              <Heart className="h-4 w-4" fill="currentColor" />
            </span>
            <span className="font-display text-lg">{settings?.store_name || 'AME Açaí & Pastéis'}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[hsl(273_20%_76%)]">
            {settings?.slogan} {settings?.tagline}
          </p>
          <span
            className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${
              isOpen ? 'border-gold-30 text-gold-soft' : 'border-[hsl(0_50%_42%)] text-[hsl(0_70%_85%)]'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'animate-pulse bg-gold' : 'bg-[hsl(0_70%_70%)]'}`} />
            {isOpen ? 'Aberto agora' : 'Fechado agora'}
          </span>
        </div>

        <div className="space-y-3 text-sm text-[hsl(273_20%_78%)]">
          <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">Contato e entrega</h3>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 transition hover:text-gold-soft"
          >
            <MessageCircle className="h-4 w-4 text-gold" />
            WhatsApp {settings?.whatsapp}
          </a>
          <p className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gold" />
            Entrega em domicílio (taxa à parte) e retirada no local
          </p>
          <p className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-gold" />
            Pix · Cartão de Crédito/Débito · Dinheiro
          </p>
        </div>

        <div className="space-y-3 text-sm text-[hsl(273_20%_78%)]">
          <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">Pedidos</h3>
          {cartCount > 0 ? (
            <button type="button" onClick={onOpenCart} className="text-left transition hover:text-gold-soft">
              Ver meu carrinho ({cartCount} {cartCount === 1 ? 'item' : 'itens'})
            </button>
          ) : (
            <p>Monte seu açaí e envie o pedido pelo WhatsApp.</p>
          )}
          <Link
            to="/admin"
            className="flex items-center gap-3 transition hover:text-gold-soft"
          >
            <ShieldCheck className="h-4 w-4 text-gold" />
            Área do gerente
          </Link>
        </div>
      </div>

      <div className="border-t border-gold-15 px-4 py-5 text-center text-[11px] text-[hsl(273_20%_64%)] sm:px-6">
        © {new Date().getFullYear()} {settings?.store_name || 'AME Açaí & Pastéis'} · Sabor, qualidade e muito amor ♡
      </div>
    </footer>
  );
}
const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { CreditCard, MapPin, MessageCircle } from 'lucide-react';

const HERO_IMAGE = 'https://media.db.com/images/public/6ad92b0a306dbae31eb703c2/815f4424b_generated_d03f689f.png';

export default function StoreHeader({ settings, onSeeMenu, onOpenCart }) {
  const isOpen = settings?.is_open !== false;
  const info = [
    { icon: MessageCircle, label: `WhatsApp ${settings?.whatsapp || ''}` },
    { icon: MapPin, label: 'Entrega em domicílio (taxa à parte)' },
    { icon: CreditCard, label: 'Pagamento via Pix · Cartão · Dinheiro' },
  ];

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pt-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-30 bg-gold-12 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-gold-soft">
            Cardápio digital · Delivery
          </span>

          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.03] sm:text-5xl lg:text-6xl">
            {settings?.store_name || 'AME Açaí & Pastéis'}
          </h1>

          <p className="mt-5 max-w-xl font-display text-xl italic text-gold-soft sm:text-2xl">
            {settings?.slogan}
          </p>
          {settings?.tagline && (
            <p className="mt-2 text-base text-[hsl(273_20%_78%)]">{settings.tagline}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              onClick={onSeeMenu}
              size="lg"
              className="rounded-full bg-gold px-7 text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(285_74%_8%)] transition hover:bg-gold-soft hover:glow-gold"
            >
              Ver cardápio
            </Button>
            <Button
              onClick={onOpenCart}
              size="lg"
              variant="outline"
              className="rounded-full border-gold-30 bg-transparent px-7 text-xs uppercase tracking-[0.14em] text-gold-soft transition hover:bg-gold-12 hover:text-gold-soft"
            >
              Meu carrinho
            </Button>
          </div>

          <ul className="mt-9 space-y-3">
            {info.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-[hsl(273_20%_78%)]">
                <Icon className="h-4 w-4 shrink-0 text-gold" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-[hsl(46_59%_52%/.12)] blur-3xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold-15 glow-gold-soft">
            <Image
              src={HERO_IMAGE}
              alt="Açaí cremoso com morangos e granola"
              className="h-[280px] w-full sm:h-[420px] lg:h-[520px]"
            />
          </div>
        </div>
      </div>

      {!isOpen && (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-3 rounded-2xl border border-[hsl(0_50%_42%)] bg-[hsl(0_50%_32%/.25)] px-4 py-3 text-sm text-[hsl(0_70%_88%)]">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[hsl(0_70%_70%)]" />
            {settings?.closed_message || 'A loja está fechada neste momento.'}
          </div>
        </div>
      )}
    </section>
  );
}
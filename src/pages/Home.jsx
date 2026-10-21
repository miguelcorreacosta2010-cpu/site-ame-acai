import { useState, useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';

import ProductCard from '@/components/client/ProductCard';
import AcaiBuilderDialog from '@/components/client/AcaiBuilderDialog';
import PastelDialog from '@/components/client/PastelDialog';
import CartSheet from '@/components/client/CartSheet';
import OrderSuccessDialog from '@/components/client/OrderSuccessDialog';
import StoreFooter from '@/components/client/StoreFooter';
import StoreNav from '@/components/client/StoreNav';
import StoreHeader from '@/components/client/StoreHeader';
import CategoryNav from '@/components/client/CategoryNav';
import SectionBanner from '@/components/client/SectionBanner';

import { useMenu } from '@/hooks/useMenu';
import { useCart } from '@/hooks/useCart';
import { cartTotals, currency } from '@/lib/store';

const ACAI_IMAGE = 'https://media.db.com/images/public/6ad92b0a306dbae31eb703c2/a8847af70_generated_0ec693a8.png';
const PASTEL_IMAGE = 'https://media.db.com/images/public/6ad92b0a306dbae31eb703c2/796b693c5_generated_2dcfbd39.png';

export default function Home() {
  const { products, settings, loading } = useMenu();
  const cart = useCart();

  const [cartOpen, setCartOpen] = useState(false);
  const [acaiSizeId, setAcaiSizeId] = useState(null);
  const [pastelId, setPastelId] = useState(null);
  const [orderType, setOrderType] = useState('delivery');
  const [neighborhood, setNeighborhood] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const sizes = useMemo(() => products.filter((item) => item.category === 'acai'), [products]);
  const freeAddons = useMemo(() => products.filter((item) => item.category === 'addon_free'), [products]);
  const paidAddons = useMemo(() => products.filter((item) => item.category === 'addon_paid'), [products]);
  const pastries = useMemo(() => products.filter((item) => item.category === 'pastel'), [products]);

  const isOpen = settings?.is_open !== false;
  const totals = cartTotals(cart.items, settings, orderType, neighborhood);
  const selectedPastel = pastries.find((item) => item.id === pastelId) || null;

  const categories = [
    sizes.length > 0 ? { id: 'acais', label: 'Açaís' } : null,
    pastries.length > 0 ? { id: 'pasteis', label: 'Pastéis' } : null,
  ].filter(Boolean);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleOrderCreated = (order, link) => {
    cart.clear();
    setCartOpen(false);
    setAcaiSizeId(null);
    setPastelId(null);
    setPlacedOrder({ order, link });
  };

  return (
    <div className="min-h-screen">
      <StoreNav
        settings={settings}
        cartCount={cart.count}
        cartSubtotal={cart.subtotal}
        onOpenCart={() => setCartOpen(true)}
      />

      <StoreHeader
        settings={settings}
        onSeeMenu={() => scrollTo('cardapio')}
        onOpenCart={() => setCartOpen(true)}
      />

      <main id="cardapio" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pb-32 pt-4 sm:px-6">
        {!loading && categories.length > 1 && <CategoryNav categories={categories} onSelect={scrollTo} />}

        {loading ? (
          <div className="grid gap-5 py-14 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((key) => (
              <div key={key} className="h-56 animate-pulse rounded-3xl border border-gold-15 velvet-card" />
            ))}
          </div>
        ) : (
          <>
            {sizes.length > 0 && (
              <section className="py-10">
                <SectionBanner
                  id="acais"
                  eyebrow="Monte do seu jeito"
                  title="Açaís"
                  text="Escolha o tamanho, marque os adicionais grátis e os extras que quiser. Tudo batido na hora, bem cremoso ♡"
                  image={ACAI_IMAGE}
                  imageAlt="Copo de açaí com coberturas ao redor"
                />
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {sizes.map((size) => (
                    <ProductCard
                      key={size.id}
                      product={size}
                      badge={size.name.replace('Copo ', '')}
                      hint="Adicionais grátis inclusos"
                      disabled={!isOpen}
                      onSelect={(item) => setAcaiSizeId(item.id)}
                    />
                  ))}
                </div>
                {freeAddons.length > 0 && (
                  <p className="mt-4 text-sm text-[hsl(273_20%_76%)]">
                    Adicionais grátis:{' '}
                    <span className="text-gold-soft">{freeAddons.map((item) => item.name).join(' · ')}</span>
                  </p>
                )}
              </section>
            )}

            {pastries.length > 0 && (
              <section className="py-10">
                <SectionBanner
                  id="pasteis"
                  eyebrow="Tamanho G · massa fininha"
                  title="Pastéis"
                  text="Fritos na hora, crocantes por fora e recheados com muito amor. Escolha o seu e diga como prefere."
                  image={PASTEL_IMAGE}
                  imageAlt="Pastel dourado e crocante partido ao meio"
                  reverse
                />
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pastries.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      badge="G"
                      hint="Adicione observação e quantidade"
                      disabled={!isOpen}
                      onSelect={(selected) => setPastelId(selected.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <StoreFooter settings={settings} onOpenCart={() => setCartOpen(true)} cartCount={cart.count} />

      {cart.count > 0 && !cartOpen && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between gap-3 rounded-full border border-gold-30 bg-[hsl(285_74%_9%/.96)] px-5 py-3 backdrop-blur-xl glow-gold sm:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <ShoppingBag className="h-4 w-4 text-gold" />
            {cart.count} {cart.count === 1 ? 'item' : 'itens'}
          </span>
          <span className="font-display text-lg text-gold">{currency(totals.total)}</span>
        </button>
      )}

      <AcaiBuilderDialog
        open={Boolean(acaiSizeId)}
        onOpenChange={(value) => !value && setAcaiSizeId(null)}
        sizes={sizes}
        freeAddons={freeAddons}
        paidAddons={paidAddons}
        initialSizeId={acaiSizeId}
        onAdd={(item) => {
          cart.addItem(item);
          setAcaiSizeId(null);
          setCartOpen(true);
        }}
      />

      <PastelDialog
        open={Boolean(pastelId)}
        onOpenChange={(value) => !value && setPastelId(null)}
        product={selectedPastel}
        onAdd={(item) => {
          cart.addItem(item);
          setPastelId(null);
          setCartOpen(true);
        }}
      />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        settings={settings}
        cart={cart}
        orderType={orderType}
        setOrderType={setOrderType}
        neighborhood={neighborhood}
        setNeighborhood={setNeighborhood}
        onCreated={handleOrderCreated}
      />

      <OrderSuccessDialog
        open={Boolean(placedOrder)}
        onOpenChange={(value) => !value && setPlacedOrder(null)}
        placedOrder={placedOrder}
        settings={settings}
      />
    </div>
  );
}

const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ClipboardList, LogOut, Settings as SettingsIcon, UtensilsCrossed } from 'lucide-react';
import OrdersBoard from '@/components/admin/OrdersBoard';
import ProductManager from '@/components/admin/ProductManager';
import StoreSettingsForm from '@/components/admin/StoreSettingsForm';
import ManagerGate from '@/components/admin/ManagerGate';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    const page = await db.entities.StoreSettings.list({ sort: '-created_date', limit: 1 });
    setSettings(page?.items?.[0] ?? null);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      const me = await db.auth.me().catch(() => null);
      if (!active) return;
      setUser(me);
      await loadSettings();
      if (active) setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-15 border-t-gold" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-gold-15 velvet-card p-8 text-center">
          <h1 className="font-display text-2xl">Acesso restrito</h1>
          <p className="mt-3 text-sm text-[hsl(273_20%_76%)]">
            Esta área é exclusiva do gerente da loja. Entre com a conta de administrador para gerenciar pedidos
            e o cardápio.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            {user ? (
              <Button
                onClick={() => db.auth.logout()}
                className="rounded-full bg-gold text-[hsl(285_74%_8%)] hover:bg-gold-soft"
              >
                Sair da conta
              </Button>
            ) : (
              <Button asChild className="rounded-full bg-gold text-[hsl(285_74%_8%)] hover:bg-gold-soft">
                <Link to="/login?returnTo=/admin">Entrar</Link>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              className="rounded-full border-gold-30 bg-transparent text-gold-soft hover:bg-gold-12 hover:text-gold-soft"
            >
              <Link to="/">Voltar ao cardápio</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ManagerGate>
    <div className="min-h-screen px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-gold">Painel do gerente</p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">
              {settings?.store_name || 'AME Açaí & Pastéis'}
            </h1>
            <p className="mt-2 text-sm text-[hsl(273_20%_74%)]">
              Olá, {user.full_name?.split(' ')[0] || 'gerente'} ♡
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-gold-30 bg-transparent text-xs uppercase tracking-[0.12em] text-gold-soft hover:bg-gold-12 hover:text-gold-soft"
            >
              <Link to="/">Ver cardápio</Link>
            </Button>
            <Button
              onClick={() => db.auth.logout()}
              variant="outline"
              className="rounded-full border-gold-30 bg-transparent text-xs uppercase tracking-[0.12em] text-gold-soft hover:bg-gold-12 hover:text-gold-soft"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sair
            </Button>
          </div>
        </div>

        <Tabs defaultValue="orders" className="mt-8">
          <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-full border border-gold-15 bg-[hsl(281_32%_12%)] p-1">
            <TabsTrigger
              value="orders"
              className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.12em] data-[state=active]:bg-gold data-[state=active]:text-[hsl(285_74%_8%)]"
            >
              <ClipboardList className="mr-2 h-3.5 w-3.5" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.12em] data-[state=active]:bg-gold data-[state=active]:text-[hsl(285_74%_8%)]"
            >
              <UtensilsCrossed className="mr-2 h-3.5 w-3.5" />
              Cardápio
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.12em] data-[state=active]:bg-gold data-[state=active]:text-[hsl(285_74%_8%)]"
            >
              <SettingsIcon className="mr-2 h-3.5 w-3.5" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrdersBoard settings={settings} />
          </TabsContent>
          <TabsContent value="products" className="mt-6">
            <ProductManager />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <StoreSettingsForm settings={settings} onSaved={loadSettings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ManagerGate>
  );
}
const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Plus, Power, Trash2 } from 'lucide-react';
import ProductFormDialog from '@/components/admin/ProductFormDialog';
import { currency } from '@/lib/store';

const SECTIONS = [
  { category: 'acai', title: 'Açaís (tamanhos)' },
  { category: 'pastel', title: 'Pastéis' },
  { category: 'addon_free', title: 'Adicionais grátis' },
  { category: 'addon_paid', title: 'Adicionais pagos' },
];

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    const page = await db.entities.Product.list({ sort: 'sort_order', limit: 300 });
    setProducts(page?.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (product) => {
    const nextValue = product.is_active === false;
    setProducts((current) =>
      current.map((item) => (item.id === product.id ? { ...item, is_active: nextValue } : item))
    );
    await db.entities.Product.update(product.id, { is_active: nextValue });
  };

  const confirmDelete = async () => {
    await db.entities.Product.delete(toDelete.id);
    setToDelete(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[hsl(273_20%_74%)]">
          Cadastre, edite preços e fotos, pause produtos esgotados ou remova itens do cardápio.
        </p>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className="rounded-full bg-gold px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(285_74%_8%)] hover:bg-gold-soft hover:glow-gold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo produto
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-20 animate-pulse rounded-2xl border border-gold-15 velvet-card" />
          ))}
        </div>
      ) : (
        SECTIONS.map(({ category, title }) => {
          const items = products.filter((product) => product.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} className="rounded-3xl border border-gold-15 bg-[hsl(281_32%_10%/.6)] p-4 sm:p-5">
              <h2 className="px-1 text-[10px] uppercase tracking-[0.2em] text-gold">{title}</h2>
              <ul className="mt-3 space-y-2">
                {items.map((product) => (
                  <li
                    key={product.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold-15 velvet-card px-4 py-3"
                  >
                    <div className="min-w-[180px]">
                      <p className="text-sm text-[hsl(var(--foreground))]">{product.name}</p>
                      <p className="mt-0.5 text-[11px] text-[hsl(273_20%_68%)]">
                        {currency(product.price)}
                        {product.description ? ` · ${product.description}` : ''}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${
                        product.is_active === false
                          ? 'border-[hsl(0_50%_42%)] bg-[hsl(0_50%_32%/.3)] text-[hsl(0_70%_85%)]'
                          : 'border-gold-30 bg-gold-12 text-gold-soft'
                      }`}
                    >
                      {product.is_active === false ? 'Pausado' : 'Disponível'}
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleActive(product)}
                        className="rounded-full text-[11px] uppercase tracking-[0.1em] text-gold-soft hover:bg-gold-12 hover:text-gold"
                      >
                        <Power className="mr-1 h-3.5 w-3.5" />
                        {product.is_active === false ? 'Ativar' : 'Pausar'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditing(product);
                          setDialogOpen(true);
                        }}
                        className="rounded-full text-[11px] uppercase tracking-[0.1em] text-gold-soft hover:bg-gold-12 hover:text-gold"
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setToDelete(product)}
                        className="rounded-full text-[11px] uppercase tracking-[0.1em] text-[hsl(273_20%_72%)] hover:bg-[hsl(0_50%_32%/.3)] hover:text-[hsl(0_70%_85%)]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editing}
        onSaved={load}
      />

      <AlertDialog open={Boolean(toDelete)} onOpenChange={(value) => !value && setToDelete(null)}>
        <AlertDialogContent className="border-gold-15 bg-[hsl(285_74%_7%)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Remover do cardápio?</AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(273_20%_76%)]">
              {toDelete?.name} será removido definitivamente. Se for algo temporário, prefira pausar o produto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-gold-30 bg-transparent text-gold-soft hover:bg-gold-12 hover:text-gold-soft">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-full bg-[hsl(0_60%_45%)] text-white hover:bg-[hsl(0_60%_40%)]"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
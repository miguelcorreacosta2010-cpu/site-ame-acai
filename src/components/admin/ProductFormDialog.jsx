const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'acai', label: 'Açaí (tamanho)' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'addon_free', label: 'Adicional grátis' },
  { value: 'addon_paid', label: 'Adicional pago' },
];

const EMPTY_FORM = {
  name: '',
  category: 'acai',
  price: 0,
  description: '',
  image_url: '',
  is_active: true,
  sort_order: 0,
};

export default function ProductFormDialog({ open, onOpenChange, product, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setNotice('');
    setForm(
      product
        ? {
            name: product.name || '',
            category: product.category || 'acai',
            price: product.price ?? 0,
            description: product.description || '',
            image_url: product.image_url || '',
            is_active: product.is_active !== false,
            sort_order: product.sort_order ?? 0,
          }
        : EMPTY_FORM
    );
  }, [open, product]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setNotice('');
    try {
      const { file_url } = await db.integrations.Core.UploadPublicFile({ file });
      update('image_url', file_url);
    } catch (uploadError) {
      setNotice(
        'Não foi possível enviar a foto agora. Cole o link da imagem no campo "Foto (link)" enquanto isso.'
      );
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('Informe o nome do produto.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      name: form.name.trim(),
      price: Number(form.price) || 0,
      sort_order: Number(form.sort_order) || 0,
      description: form.description.trim(),
    };
    try {
      if (product?.id) await db.entities.Product.update(product.id, payload);
      else await db.entities.Product.create(payload);
      setSaving(false);
      onOpenChange(false);
      onSaved();
    } catch (saveError) {
      setSaving(false);
      setError('Não foi possível salvar o produto. Tente novamente.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-3xl border-gold-15 bg-[hsl(285_74%_7%)] p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-xl">
            {product?.id ? 'Editar produto' : 'Novo produto'}
          </DialogTitle>
          <DialogDescription className="text-sm text-[hsl(273_20%_76%)]">
            Produtos pausados continuam no cardápio do painel, mas não aparecem para o cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-4">
          <div>
            <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Nome</Label>
            <Input
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder="Ex: Copo 500 ml"
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Categoria</Label>
              <select
                value={form.category}
                onChange={(event) => update('category', event.target.value)}
                className="mt-2 w-full rounded-xl border border-gold-15 bg-[hsl(281_32%_14%)] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gold"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Preço (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(event) => update('price', event.target.value)}
                className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
              />
            </div>
          </div>

          <div>
            <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Descrição</Label>
            <Textarea
              value={form.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="Ex: Açaí cremoso batido na hora"
              className="mt-2 min-h-[70px] rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] text-sm focus-visible:ring-gold"
            />
          </div>

          <div>
            <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Foto (link)</Label>
            <Input
              value={form.image_url}
              onChange={(event) => update('image_url', event.target.value)}
              placeholder="https://..."
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold-30 px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-gold-soft transition hover:bg-gold-12">
              <Upload className="h-3.5 w-3.5" />
              {uploading ? 'Enviando...' : 'Enviar foto do computador'}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-gold-15 velvet-card px-4 py-3">
            <div>
              <p className="text-sm">Disponível para pedidos</p>
              <p className="text-[11px] text-[hsl(273_20%_68%)]">Desligue quando o produto esgotar</p>
            </div>
            <Switch
              checked={form.is_active !== false}
              onCheckedChange={(checked) => update('is_active', checked)}
              className="data-[state=checked]:bg-gold"
            />
          </div>

          <div>
            <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Ordem de exibição</Label>
            <Input
              type="number"
              value={form.sort_order}
              onChange={(event) => update('sort_order', event.target.value)}
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>

          {notice && (
            <p className="rounded-xl border border-gold-30 bg-gold-12 px-3 py-2 text-xs text-gold-soft">{notice}</p>
          )}
          {error && (
            <p className="rounded-xl border border-[hsl(0_50%_42%)] bg-[hsl(0_50%_32%/.25)] px-3 py-2 text-xs text-[hsl(0_70%_88%)]">
              {error}
            </p>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-full border-gold-30 bg-transparent text-xs uppercase tracking-[0.12em] text-gold-soft hover:bg-gold-12 hover:text-gold-soft"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 rounded-full bg-gold text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(285_74%_8%)] hover:bg-gold-soft hover:glow-gold disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Salvar produto'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
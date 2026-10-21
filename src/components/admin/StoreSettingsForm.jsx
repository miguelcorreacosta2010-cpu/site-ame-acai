const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

const EMPTY = {
  store_name: 'AME Açaí & Pastéis',
  slogan: 'Sabor, qualidade e muito amor ♡',
  tagline: 'Açaí é sempre uma boa ideia!',
  whatsapp: '',
  is_open: true,
  closed_message: '',
  delivery_fee_mode: 'fixed',
  fixed_delivery_fee: 0,
  delivery_fees: [],
  pix_key: '',
  pickup_address: '',
};

export default function StoreSettingsForm({ settings, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!settings) return;
    setForm({
      store_name: settings.store_name || '',
      slogan: settings.slogan || '',
      tagline: settings.tagline || '',
      whatsapp: settings.whatsapp || '',
      is_open: settings.is_open !== false,
      closed_message: settings.closed_message || '',
      delivery_fee_mode: settings.delivery_fee_mode || 'fixed',
      fixed_delivery_fee: settings.fixed_delivery_fee ?? 0,
      delivery_fees: settings.delivery_fees || [],
      pix_key: settings.pix_key || '',
      pickup_address: settings.pickup_address || '',
    });
  }, [settings]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const updateFee = (index, key, value) =>
    setForm((current) => ({
      ...current,
      delivery_fees: current.delivery_fees.map((fee, position) =>
        position === index ? { ...fee, [key]: value } : fee
      ),
    }));

  const addFee = () =>
    setForm((current) => ({ ...current, delivery_fees: [...current.delivery_fees, { neighborhood: '', fee: 0 }] }));

  const removeFee = (index) =>
    setForm((current) => ({
      ...current,
      delivery_fees: current.delivery_fees.filter((fee, position) => position !== index),
    }));

  const handleSave = async () => {
    setSaving(true);
    setFeedback('');
    const payload = {
      ...form,
      fixed_delivery_fee: Number(form.fixed_delivery_fee) || 0,
      delivery_fees: form.delivery_fees
        .filter((fee) => fee.neighborhood?.trim())
        .map((fee) => ({ neighborhood: fee.neighborhood.trim(), fee: Number(fee.fee) || 0 })),
    };
    try {
      if (settings?.id) await db.entities.StoreSettings.update(settings.id, payload);
      else await db.entities.StoreSettings.create(payload);
      await onSaved();
      setFeedback('Configurações salvas ♡');
    } catch (error) {
      setFeedback('Não foi possível salvar as configurações. Tente novamente.');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gold-15 bg-[hsl(281_32%_10%/.6)] p-5">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-gold">Status da loja</h2>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-gold-15 velvet-card px-4 py-3">
          <div>
            <p className="text-sm">{form.is_open ? 'Loja aberta para pedidos' : 'Loja fechada'}</p>
            <p className="text-[11px] text-[hsl(273_20%_68%)]">
              Quando fechada, o cardápio continua visível mas os pedidos ficam bloqueados.
            </p>
          </div>
          <Switch
            checked={form.is_open !== false}
            onCheckedChange={(checked) => update('is_open', checked)}
            className="data-[state=checked]:bg-gold"
          />
        </div>
        <div className="mt-4">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Mensagem de loja fechada</Label>
          <Textarea
            value={form.closed_message}
            onChange={(event) => update('closed_message', event.target.value)}
            className="mt-2 min-h-[70px] rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] text-sm focus-visible:ring-gold"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-gold-15 bg-[hsl(281_32%_10%/.6)] p-5">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-gold">Dados da loja</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Nome da loja</Label>
            <Input
              value={form.store_name}
              onChange={(event) => update('store_name', event.target.value)}
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">WhatsApp dos pedidos</Label>
            <Input
              value={form.whatsapp}
              onChange={(event) => update('whatsapp', event.target.value)}
              placeholder="(51) 98178-5226"
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Slogan do banner</Label>
            <Input
              value={form.slogan}
              onChange={(event) => update('slogan', event.target.value)}
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Frase de apoio</Label>
            <Input
              value={form.tagline}
              onChange={(event) => update('tagline', event.target.value)}
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Chave Pix</Label>
            <Input
              value={form.pix_key}
              onChange={(event) => update('pix_key', event.target.value)}
              placeholder="CPF, telefone, e-mail ou chave aleatória"
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Endereço de retirada</Label>
            <Input
              value={form.pickup_address}
              onChange={(event) => update('pickup_address', event.target.value)}
              placeholder="Rua, número e bairro"
              className="mt-2 rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gold-15 bg-[hsl(281_32%_10%/.6)] p-5">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-gold">Taxa de entrega</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            { id: 'fixed', label: 'Taxa fixa para todos os bairros' },
            { id: 'neighborhood', label: 'Taxa por bairro' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => update('delivery_fee_mode', option.id)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                form.delivery_fee_mode === option.id
                  ? 'border-gold bg-gold-12 text-gold-soft'
                  : 'border-gold-15 hover:border-gold-30'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-gold">Valor da taxa fixa (R$)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.fixed_delivery_fee}
            onChange={(event) => update('fixed_delivery_fee', event.target.value)}
            className="mt-2 max-w-[180px] rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
          />
          <p className="mt-2 text-[11px] text-[hsl(273_20%_68%)]">
            Usada também para bairros que não estiverem na lista abaixo.
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold">Taxas por bairro</p>
          {form.delivery_fees.length === 0 && (
            <p className="rounded-2xl border border-dashed border-gold-15 px-4 py-4 text-xs text-[hsl(273_20%_66%)]">
              Nenhum bairro cadastrado.
            </p>
          )}
          {form.delivery_fees.map((fee, index) => (
            <div key={`fee-${index}`} className="flex items-center gap-2">
              <Input
                value={fee.neighborhood}
                onChange={(event) => updateFee(index, 'neighborhood', event.target.value)}
                placeholder="Bairro"
                className="rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
              />
              <Input
                type="number"
                step="0.01"
                min="0"
                value={fee.fee}
                onChange={(event) => updateFee(index, 'fee', event.target.value)}
                className="max-w-[130px] rounded-xl border-gold-15 bg-[hsl(281_32%_14%)] focus-visible:ring-gold"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeFee(index)}
                className="rounded-full text-[hsl(273_20%_72%)] hover:bg-[hsl(0_50%_32%/.3)] hover:text-[hsl(0_70%_85%)]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addFee}
            className="rounded-full border-gold-30 bg-transparent text-[11px] uppercase tracking-[0.12em] text-gold-soft hover:bg-gold-12 hover:text-gold-soft"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Adicionar bairro
          </Button>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-gold px-7 text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(285_74%_8%)] hover:bg-gold-soft hover:glow-gold disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </Button>
        {feedback && <p className="text-sm text-gold-soft">{feedback}</p>}
      </div>
    </div>
  );
}
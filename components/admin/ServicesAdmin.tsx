'use client';
import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Service } from '@/lib/types';
import { uploadImage } from '@/lib/upload';

const blank = { name: "", description: "" as string | null, price: 0, duration_min: 60, image_url: null as string | null, active: true, sort: 0 };

function Row({ s, onSaved }: { s: Partial<Service> & typeof blank; onSaved: () => void }) {
  const sb = getSupabase()!;
  const [v, setV] = useState(s);
  const [msg, setMsg] = useState('');
  const isNew = !('id' in s) || !s.id;

  async function save() {
    const { id, ...rest } = v as Service;
    const payload = { ...rest, price: Number(rest.price), duration_min: Number(rest.duration_min) };
    const { error } = isNew ? await sb.from('services').insert(payload) : await sb.from('services').update(payload).eq('id', id);
    setMsg(error ? 'Erro ao salvar' : 'Salvo');
    if (!error) { if (isNew) setV(blank); onSaved(); }
  }
  async function remove() {
    if (!confirm(`Excluir "${v.name}"?`)) return;
    await sb.from('services').delete().eq('id', (v as Service).id);
    onSaved();
  }
  return (
    <div className="grid gap-3 rounded-3xl bg-white p-5 shadow-soft md:grid-cols-[1fr_8rem_8rem]">
      <input className="field" placeholder="Nome do serviço" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
      <input className="field" type="number" min={0} step="0.01" aria-label="Preço (R$)" placeholder="Preço" value={v.price} onChange={(e) => setV({ ...v, price: Number(e.target.value) })} />
      <input className="field" type="number" min={15} step={15} aria-label="Duração (min)" placeholder="Minutos" value={v.duration_min} onChange={(e) => setV({ ...v, duration_min: Number(e.target.value) })} />
      <textarea className="field md:col-span-3" rows={2} placeholder="Descrição" value={v.description ?? ''} onChange={(e) => setV({ ...v, description: e.target.value })} />
      <div className="flex flex-wrap items-center gap-3 md:col-span-3">
        <label className="text-sm text-navy/70">Foto <input type="file" accept="image/*" className="ml-2 text-xs" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setV({ ...v, image_url: await uploadImage(f, 'services') }); }} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} /> Visível no site</label>
        <button className="btn btn-primary !py-2" onClick={save} disabled={!v.name}>{isNew ? 'Adicionar' : 'Salvar'}</button>
        {!isNew && <button className="btn btn-ghost !py-2" onClick={remove}>Excluir</button>}
        <span className="text-sm text-navy/60" role="status">{msg}</span>
      </div>
    </div>
  );
}

export default function ServicesAdmin() {
  const sb = getSupabase()!;
  const [list, setList] = useState<Service[]>([]);
  const load = useCallback(async () => {
    const { data } = await sb.from('services').select('*').order('sort').order('name');
    setList((data ?? []).map((x) => ({ ...x, price: Number(x.price) })));
  }, [sb]);
  useEffect(() => { load(); }, [load]);
  return (
    <div className="space-y-4">
      <h2 className="font-display text-3xl">Novo serviço</h2>
      <Row s={blank} onSaved={load} />
      <h2 className="pt-6 font-display text-3xl">Serviços cadastrados</h2>
      {list.map((s) => <Row key={s.id + s.name + s.price} s={s} onSaved={load} />)}
    </div>
  );
}

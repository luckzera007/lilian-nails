'use client';
import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { CATEGORIES, PortfolioItem } from '@/lib/types';
import { removeImage, uploadImage } from '@/lib/upload';

export default function PortfolioAdmin() {
  const sb = getSupabase()!;
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const { data } = await sb.from('portfolio').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setMsg('');
    try {
      for (const f of Array.from(files)) {
        const url = await uploadImage(f);
        const { error } = await sb.from('portfolio').insert({ category, title: title || null, image_url: url });
        if (error) throw error;
      }
      setTitle(''); load();
    } catch { setMsg('Não foi possível enviar. Confira se o SQL do Supabase foi executado.'); }
    setBusy(false);
  }

  async function remove(it: PortfolioItem) {
    if (!confirm('Remover esta foto do portfólio?')) return;
    await sb.from('portfolio').delete().eq('id', it.id);
    await removeImage(it.image_url);
    load();
  }

  return (
    <div>
      <div className="grid gap-3 rounded-3xl bg-white p-5 shadow-soft md:grid-cols-3">
        <select className="field" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Categoria">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <input className="field" placeholder="Legenda (opcional)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="field" type="file" accept="image/*" multiple disabled={busy} onChange={(e) => add(e.target.files)} aria-label="Escolher fotos" />
        {msg && <p className="text-sm text-red-700 md:col-span-3" role="alert">{msg}</p>}
        {busy && <p className="text-sm text-navy/60 md:col-span-3">Enviando…</p>}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((it) => (
          <figure key={it.id} className="relative overflow-hidden rounded-2xl bg-white shadow-soft">
            <img src={it.image_url ?? undefined} alt={it.title ?? it.category} className="aspect-square w-full object-cover" />
            <figcaption className="p-2 text-xs text-navy/70">{it.category}</figcaption>
            <button onClick={() => remove(it)} aria-label="Remover foto" className="absolute right-2 top-2 rounded-full bg-white/90 p-2"><Trash2 size={14} /></button>
          </figure>
        ))}
        {items.length === 0 && <p className="col-span-full text-navy/60">Nenhuma foto ainda. Envie a primeira acima.</p>}
      </div>
    </div>
  );
}

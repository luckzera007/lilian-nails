'use client';
import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { Blocked, Settings, WEEKDAYS } from '@/lib/types';
import { DEMO_SETTINGS } from '@/lib/demo';
import { brDate, hhmm } from '@/lib/slots';
import { uploadImage } from '@/lib/upload';

export default function Hours() {
  const sb = getSupabase()!;
  const [s, setS] = useState<Settings>(DEMO_SETTINGS);
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [msg, setMsg] = useState('');
  const [nb, setNb] = useState({ day: '', start_time: '', end_time: '', reason: '' });

  const load = useCallback(async () => {
    const [a, b] = await Promise.all([sb.from('settings').select('*').eq('id', 1).maybeSingle(), sb.from('blocked').select('*').order('day')]);
    if (a.data) setS({ ...DEMO_SETTINGS, ...a.data, open_time: hhmm(String(a.data.open_time)), close_time: hhmm(String(a.data.close_time)) });
    setBlocked(b.data ?? []);
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  async function save() {
    const { error } = await sb.from('settings').upsert({ ...s, id: 1 });
    setMsg(error ? 'Erro ao salvar' : 'Configurações salvas');
  }
  async function addBlock() {
    if (!nb.day) return;
    await sb.from('blocked').insert({ day: nb.day, start_time: nb.start_time || null, end_time: nb.end_time || null, reason: nb.reason || null });
    setNb({ day: '', start_time: '', end_time: '', reason: '' }); load();
  }
  const up = (k: keyof Settings) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) setS({ ...s, [k]: await uploadImage(f, 'site') });
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-3xl">Atendimento</h2>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((w, i) => (
            <label key={w} className={`cursor-pointer rounded-full px-4 py-2 text-sm ${s.open_days.includes(i) ? 'bg-navy text-white' : 'bg-cloud'}`}>
              <input type="checkbox" className="sr-only" checked={s.open_days.includes(i)} onChange={() => setS({ ...s, open_days: s.open_days.includes(i) ? s.open_days.filter((d) => d !== i) : [...s.open_days, i] })} />
              {w.slice(0, 3)}
            </label>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm">Abre<input type="time" className="field mt-1" value={s.open_time} onChange={(e) => setS({ ...s, open_time: e.target.value })} /></label>
          <label className="text-sm">Fecha<input type="time" className="field mt-1" value={s.close_time} onChange={(e) => setS({ ...s, close_time: e.target.value })} /></label>
          <label className="text-sm">Intervalo entre horários (min)<input type="number" min={15} step={15} className="field mt-1" value={s.step_min} onChange={(e) => setS({ ...s, step_min: Number(e.target.value) })} /></label>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-3xl">Contato e textos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Nome do estúdio<input className="field mt-1" value={s.studio_name} onChange={(e) => setS({ ...s, studio_name: e.target.value })} /></label>
          <label className="text-sm">WhatsApp (com 55 e DDD)<input className="field mt-1" value={s.whatsapp} onChange={(e) => setS({ ...s, whatsapp: e.target.value })} /></label>
          <label className="text-sm">Instagram (sem @)<input className="field mt-1" value={s.instagram} onChange={(e) => setS({ ...s, instagram: e.target.value })} /></label>
          <label className="text-sm">Endereço<input className="field mt-1" value={s.address} onChange={(e) => setS({ ...s, address: e.target.value })} /></label>
        </div>
        <label className="block text-sm">Texto "Sobre mim"<textarea rows={4} className="field mt-1" value={s.about_text} onChange={(e) => setS({ ...s, about_text: e.target.value })} /></label>
        <div className="flex flex-wrap gap-6 text-sm">
          <label>Foto principal (início) <input type="file" accept="image/*" onChange={up('hero_image')} className="ml-2 text-xs" /></label>
          <label>Foto "Sobre mim" <input type="file" accept="image/*" onChange={up('about_image')} className="ml-2 text-xs" /></label>
        </div>
        <div className="flex items-center gap-4"><button className="btn btn-primary" onClick={save}>Salvar configurações</button><span className="text-sm text-navy/60" role="status">{msg}</span></div>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-3xl">Bloquear datas e horários</h2>
        <p className="text-sm text-navy/60">Deixe início e fim em branco para bloquear o dia inteiro.</p>
        <div className="grid gap-3 sm:grid-cols-5">
          <input type="date" className="field" aria-label="Data" value={nb.day} onChange={(e) => setNb({ ...nb, day: e.target.value })} />
          <input type="time" className="field" aria-label="Início" value={nb.start_time} onChange={(e) => setNb({ ...nb, start_time: e.target.value })} />
          <input type="time" className="field" aria-label="Fim" value={nb.end_time} onChange={(e) => setNb({ ...nb, end_time: e.target.value })} />
          <input className="field" placeholder="Motivo" value={nb.reason} onChange={(e) => setNb({ ...nb, reason: e.target.value })} />
          <button className="btn btn-primary" onClick={addBlock} disabled={!nb.day}>Bloquear</button>
        </div>
        <ul className="divide-y divide-sky/30">
          {blocked.map((b) => (
            <li key={b.id} className="flex items-center justify-between py-3 text-sm">
              <span>{brDate(b.day)} · {b.start_time ? `${hhmm(b.start_time)}–${hhmm(b.end_time ?? '')}` : 'dia inteiro'}{b.reason ? ` · ${b.reason}` : ''}</span>
              <button aria-label="Remover bloqueio" onClick={async () => { await sb.from('blocked').delete().eq('id', b.id); load(); }}><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

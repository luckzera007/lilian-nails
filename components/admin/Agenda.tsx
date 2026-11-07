'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { Booking } from '@/lib/types';
import { brDate, fromMin, hhmm, iso, toMin } from '@/lib/slots';

const VIEWS = ['Hoje', 'Semana', 'Mês', 'Todos', 'Clientes'] as const;
const STATUS = { pending: 'Pendente', confirmed: 'Confirmado', canceled: 'Cancelado' } as const;

export default function Agenda() {
  const sb = getSupabase()!;
  const [all, setAll] = useState<Booking[]>([]);
  const [view, setView] = useState<(typeof VIEWS)[number]>('Semana');

  const load = useCallback(async () => {
    const { data } = await sb.from('bookings').select('*').order('day').order('start_time');
    setAll((data ?? []).map((b) => ({ ...b, start_time: hhmm(String(b.start_time)) })));
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: Booking['status']) {
    await sb.from('bookings').update({ status }).eq('id', id);
    load();
  }

  const list = useMemo(() => {
    const today = iso(new Date());
    const end = new Date(); end.setDate(end.getDate() + (view === 'Semana' ? 7 : 31));
    return all.filter((b) => view === 'Todos' || (view === 'Hoje' ? b.day === today : b.day >= today && b.day <= iso(end)));
  }, [all, view]);

  const clients = useMemo(() => {
    const m = new Map<string, { name: string; phone: string; visits: number; last: string }>();
    all.filter((b) => b.status !== 'canceled').forEach((b) => {
      const c = m.get(b.client_phone);
      m.set(b.client_phone, { name: b.client_name, phone: b.client_phone, visits: (c?.visits ?? 0) + 1, last: !c || b.day > c.last ? b.day : c.last });
    });
    return [...m.values()].sort((a, b) => b.last.localeCompare(a.last));
  }, [all]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <button key={v} onClick={() => setView(v)} className={`rounded-full px-4 py-2 text-sm ${view === v ? 'bg-navy text-white' : 'bg-white'}`}>{v}</button>
        ))}
      </div>

      {view === 'Clientes' ? (
        <ul className="mt-6 divide-y divide-sky/30 rounded-3xl bg-white shadow-soft">
          {clients.length === 0 && <li className="p-6 text-navy/60">Nenhuma cliente ainda.</li>}
          {clients.map((c) => (
            <li key={c.phone} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div><p className="font-medium">{c.name}</p><p className="text-sm text-navy/60">{c.visits} agendamento(s) · último em {brDate(c.last)}</p></div>
              <a className="btn btn-ghost !py-2" href={`https://wa.me/${c.phone}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> {c.phone.replace(/^55/, '')}</a>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.length === 0 && <li className="rounded-3xl bg-white p-6 text-navy/60">Nenhum agendamento neste período.</li>}
          {list.map((b) => (
            <li key={b.id} className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-soft ${b.status === 'canceled' ? 'opacity-55' : ''}`}>
              <div>
                <p className="font-medium">{brDate(b.day)} · {b.start_time}–{fromMin(toMin(b.start_time) + b.duration_min)}</p>
                <p className="text-sm text-navy/75">{b.service_name} · {b.client_name}</p>
                <p className="mt-1 text-xs"><span className={`rounded-full px-2.5 py-1 ${b.status === 'confirmed' ? 'bg-mist' : b.status === 'pending' ? 'bg-sky/50' : 'bg-navy/10'}`}>{STATUS[b.status]}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="btn btn-ghost !py-2" href={`https://wa.me/${b.client_phone}?text=${encodeURIComponent(`Olá, ${b.client_name.split(' ')[0]}! Seu horário de ${b.service_name} em ${brDate(b.day)} às ${b.start_time} está confirmado.`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp</a>
                {b.status !== 'confirmed' && b.status !== 'canceled' && <button className="btn btn-primary !py-2" onClick={() => setStatus(b.id, 'confirmed')}>Confirmar</button>}
                {b.status !== 'canceled' && <button className="btn btn-ghost !py-2" onClick={() => confirm('Cancelar este agendamento?') && setStatus(b.id, 'canceled')}>Cancelar</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

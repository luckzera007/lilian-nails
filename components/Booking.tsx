'use client';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { Blocked, Busy, Service, Settings } from '@/lib/types';
import { brDate, brl, duration, freeSlots, iso } from '@/lib/slots';
import { getSupabase } from '@/lib/supabase';
import { demoBlocked, demoBusy } from '@/lib/demo';

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function Booking({ services, settings, demo }: { services: Service[]; settings: Settings; demo: boolean }) {
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState<Busy[]>([]);
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const service = services.find((s) => s.id === serviceId) ?? null;

  async function load() {
    if (demo) { setBusy(demoBusy()); setBlocked(demoBlocked()); return; }
    const sb = getSupabase();
    if (!sb) return;
    const today = iso(new Date());
    const [b, bl] = await Promise.all([sb.from('public_busy').select('*').gte('day', today), sb.from('blocked').select('*').gte('day', today)]);
    setBusy((b.data ?? []).map((x) => ({ ...x, start_time: String(x.start_time).slice(0, 5) })));
    setBlocked((bl.data ?? []).map((x) => ({ ...x, start_time: x.start_time && String(x.start_time).slice(0, 5), end_time: x.end_time && String(x.end_time).slice(0, 5) })));
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const h = (e: Event) => { setServiceId((e as CustomEvent<string>).detail); setDay(null); setTime(null); setDone(false); };
    window.addEventListener('book-service', h);
    return () => window.removeEventListener('book-service', h);
  }, []);

  const slotsOf = (d: string) => (service ? freeSlots({ day: d, duration: service.duration_min, settings, busy, blocked }) : []);
  const times = useMemo(() => (day ? slotsOf(day) : []), [day, service, busy, blocked]); // eslint-disable-line react-hooks/exhaustive-deps

  const cells = useMemo(() => {
    const first = month.getDay();
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => iso(new Date(month.getFullYear(), month.getMonth(), i + 1)))] as (string | null)[];
  }, [month]);

  const digits = phone.replace(/\D/g, '');
  const nameOk = name.trim().split(/\s+/).length >= 2 && name.trim().length >= 5;
  const phoneOk = digits.length === 10 || digits.length === 11;

  function maskPhone(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  async function confirm() {
    if (!service || !day || !time || !nameOk || !phoneOk) return;
    setSaving(true); setError('');
    if (!demo) {
      const sb = getSupabase()!;
      const { error: err } = await sb.from('bookings').insert({
        service_id: service.id, service_name: service.name, day, start_time: time, duration_min: service.duration_min,
        client_name: name.trim(), client_phone: `55${digits}`,
      });
      if (err) {
        setSaving(false);
        setError(err.message.includes('indisponível') ? 'Esse horário acabou de ser ocupado. Escolha outro.' : 'Não foi possível salvar. Tente novamente em instantes.');
        setTime(null); load();
        return;
      }
    }
    setSaving(false); setDone(true); load();
  }

  const waText = service && day && time
    ? `Olá, Lilian! Acabei de agendar pelo site.\n\nServiço: ${service.name}\nData: ${brDate(day)} às ${time}\nNome: ${name.trim()}\nWhatsApp: ${phone}`
    : '';
  const waLink = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(waText)}`;

  function reset() { setServiceId(null); setDay(null); setTime(null); setName(''); setPhone(''); setDone(false); setError(''); }

  return (
    <section id="agendar" className="bg-mist/50 py-20">
      <div className="mx-auto max-w-4xl px-5">
        <h2 className="font-display text-4xl md:text-5xl">Agende seu horário</h2>
        {demo && <p className="mt-3 text-sm text-navy/60">Modo demonstração: os agendamentos ainda não são salvos. Conecte o Supabase para ativar.</p>}

        {done && service && day && time ? (
          <div className="mt-10 rounded-3xl bg-white p-8 text-center shadow-soft" role="status">
            <CheckCircle2 className="mx-auto text-navy" size={44} strokeWidth={1.4} />
            <h3 className="mt-4 font-display text-3xl">Horário reservado, {name.trim().split(' ')[0]}!</h3>
            <p className="mt-2 text-navy/75">{service.name} · {brDate(day)} às {time}</p>
            <p className="mt-1 text-sm text-navy/60">A Lilian vai confirmar seu agendamento pelo WhatsApp.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><MessageCircle size={18} /> Avisar a Lilian no WhatsApp</a>
              <button onClick={reset} className="btn btn-ghost">Novo agendamento</button>
            </div>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            <div>
              <h3 className="font-display text-2xl">Qual serviço você quer?</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <button key={s.id} onClick={() => { setServiceId(s.id); setDay(null); setTime(null); }} aria-pressed={serviceId === s.id}
                    className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${serviceId === s.id ? 'border-navy bg-white shadow-soft' : 'border-sky/50 bg-white/60 hover:bg-white'}`}>
                    <span><span className="block font-medium">{s.name}</span><span className="text-xs text-navy/60">{duration(s.duration_min)}</span></span>
                    <span className="font-display text-xl">{brl(s.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {service && (
              <div>
                <h3 className="font-display text-2xl">Escolha o dia</h3>
                <div className="mt-4 max-w-md rounded-3xl bg-white p-5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Mês anterior"
                      disabled={month <= new Date(new Date().getFullYear(), new Date().getMonth(), 1)} className="p-2 disabled:opacity-30"><ChevronLeft size={18} /></button>
                    <span className="font-medium">{MONTHS[month.getMonth()]} {month.getFullYear()}</span>
                    <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Próximo mês" className="p-2"><ChevronRight size={18} /></button>
                  </div>
                  <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-navy/50">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((w, i) => <span key={i}>{w}</span>)}
                  </div>
                  <div className="mt-1 grid grid-cols-7 gap-1">
                    {cells.map((c, i) => {
                      if (!c) return <span key={i} />;
                      const ok = slotsOf(c).length > 0;
                      return (
                        <button key={c} disabled={!ok} onClick={() => { setDay(c); setTime(null); }} aria-pressed={day === c}
                          className={`aspect-square rounded-full text-sm transition-colors ${day === c ? 'bg-navy text-white' : ok ? 'bg-mist/70 hover:bg-sky' : 'text-navy/25 line-through'}`}>
                          {Number(c.slice(8))}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-navy/55">Dias riscados estão sem horário disponível.</p>
                </div>
              </div>
            )}

            {service && day && (
              <div>
                <h3 className="font-display text-2xl">Horários livres em {brDate(day)}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {times.length === 0 && <p className="text-sm text-navy/60">Sem horários neste dia. Escolha outra data.</p>}
                  {times.map((t) => (
                    <button key={t} onClick={() => setTime(t)} aria-pressed={time === t}
                      className={`rounded-full px-5 py-2 text-sm transition-colors ${time === t ? 'bg-navy text-white' : 'bg-white hover:bg-sky'}`}>{t}</button>
                  ))}
                </div>
              </div>
            )}

            {service && day && time && (
              <div>
                <h3 className="font-display text-2xl">Seus dados</h3>
                <div className="mt-4 grid max-w-xl gap-4">
                  <label className="text-sm">Nome completo
                    <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                    {name && !nameOk && <span className="text-xs text-red-700">Informe nome e sobrenome.</span>}
                  </label>
                  <label className="text-sm">WhatsApp com DDD
                    <input className="field mt-1" inputMode="tel" placeholder="(41) 99999-9999" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} autoComplete="tel" />
                    {phone && !phoneOk && <span className="text-xs text-red-700">Informe DDD e número.</span>}
                  </label>
                  {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
                  <button onClick={confirm} disabled={!nameOk || !phoneOk || saving} className="btn btn-primary justify-self-start">
                    {saving ? 'Salvando…' : `Confirmar agendamento · ${time}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

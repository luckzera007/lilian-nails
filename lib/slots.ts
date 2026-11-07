import { Blocked, Busy, Settings } from './types';

const pad = (n: number) => String(n).padStart(2, '0');
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseIso = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export const fromMin = (n: number) => `${pad(Math.floor(n / 60))}:${pad(n % 60)}`;
export const hhmm = (t: string) => t.slice(0, 5);
export const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const duration = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? pad(min % 60) : ''}` : `${min} min`);
export const brDate = (s: string) => parseIso(s).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

/** Horários livres de um dia para um serviço com a duração informada. */
export function freeSlots(o: { day: string; duration: number; settings: Settings; busy: Busy[]; blocked: Blocked[]; now?: Date }): string[] {
  const { day, duration: dur, settings, busy, blocked } = o;
  const now = o.now ?? new Date();
  if (day < iso(now)) return [];
  if (!settings.open_days.includes(parseIso(day).getDay())) return [];
  if (blocked.some((b) => b.day === day && !b.start_time)) return [];

  const intervals: [number, number][] = [
    ...busy.filter((b) => b.day === day).map((b): [number, number] => [toMin(b.start_time), toMin(b.start_time) + b.duration_min]),
    ...blocked.filter((b) => b.day === day && b.start_time && b.end_time).map((b): [number, number] => [toMin(b.start_time!), toMin(b.end_time!)]),
  ];
  const open = toMin(settings.open_time);
  const close = toMin(settings.close_time);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isToday = day === iso(now);
  const out: string[] = [];
  for (let t = open; t + dur <= close; t += settings.step_min) {
    if (isToday && t <= nowMin + 30) continue;
    if (intervals.some(([s, e]) => t < e && t + dur > s)) continue;
    out.push(fromMin(t));
  }
  return out;
}

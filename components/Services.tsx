'use client';
import { Clock } from 'lucide-react';
import Photo from './Photo';
import { Service } from '@/lib/types';
import { brl, duration } from '@/lib/slots';

export default function Services({ services }: { services: Service[] }) {
  function book(id: string) {
    window.dispatchEvent(new CustomEvent('book-service', { detail: id }));
    document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <section id="servicos" className="mx-auto max-w-4xl px-5 py-20">
      <h2 className="font-display text-4xl md:text-5xl">Serviços e valores</h2>
      <ul className="mt-10 divide-y divide-sky/40">
        {services.map((s, i) => (
          <li key={s.id} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
            <Photo src={s.image_url} alt={s.name} i={i} className="h-28 w-full shrink-0 rounded-2xl sm:w-28" />
            <div className="flex-1">
              <h3 className="font-display text-2xl">{s.name}</h3>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-navy/70">{s.description}</p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-navy/60"><Clock size={14} /> {duration(s.duration_min)}</p>
            </div>
            <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
              <span className="font-display text-3xl">{brl(s.price)}</span>
              <button onClick={() => book(s.id)} className="btn btn-ghost !py-2">Agendar</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

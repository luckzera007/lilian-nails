import Image from 'next/image';
import { CalendarHeart } from 'lucide-react';
import { Settings } from '@/lib/types';

export default function Hero({ settings }: { settings: Settings }) {
  return (
    <section id="inicio" className="bg-cloud">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div className="hero-in">
          <p className="font-script text-4xl text-navy/80">{settings.studio_name}</p>
          <h1 className="mt-3 font-display text-5xl font-medium leading-[1.05] md:text-7xl">Realçando sua beleza em cada detalhe.</h1>
          <p className="mt-6 max-w-md leading-relaxed text-navy/75">
            Alongamento em gel, fibra de vidro, banho de gel e nail art feitos com calma, técnica e atenção ao que combina com você.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#agendar" className="btn btn-primary"><CalendarHeart size={18} /> Agendar meu horário</a>
            <a href="#portfolio" className="btn btn-ghost">Conheça meu trabalho</a>
          </div>
        </div>
        <div className="mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full bg-mist/70 shadow-soft">
          {settings.hero_image ? (
            <img src={settings.hero_image} alt="Unhas decoradas por Lilian Nails" className="h-full w-full object-cover" />
          ) : (
            <Image src="/logo.png" alt="Logo Lilian Nails – Nails & Art" width={640} height={640} priority className="h-full w-full object-contain mix-blend-multiply" />
          )}
        </div>
      </div>
    </section>
  );
}

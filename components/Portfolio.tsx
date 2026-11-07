'use client';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, X } from 'lucide-react';
import Photo from './Photo';
import { CATEGORIES, PortfolioItem } from '@/lib/types';

export default function Portfolio({ items }: { items: PortfolioItem[] }) {
  const [cat, setCat] = useState('Todos');
  const [open, setOpen] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const cats = ['Todos', ...CATEGORIES.filter((c) => items.some((i) => i.category === c))];
  const list = cat === 'Todos' ? items : items.filter((i) => i.category === cat);

  const move = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + list.length) % list.length)), [list.length]);
  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, move]);

  async function share() {
    const url = `${location.origin}/#portfolio`;
    if (navigator.share) await navigator.share({ title: 'Lilian Nails – Portfólio', url }).catch(() => {});
    else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }

  return (
    <section id="portfolio" className="bg-cloud py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl md:text-5xl">Meu trabalho</h2>
          <button onClick={share} className="btn btn-ghost !py-2"><Share2 size={16} /> {copied ? 'Link copiado' : 'Compartilhar portfólio'}</button>
        </div>
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorias">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${cat === c ? 'bg-navy text-white' : 'bg-white text-navy/75 hover:bg-mist'}`}>
              {c}
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <p className="mt-10 text-navy/60">Ainda não há fotos nesta categoria.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {list.map((it, i) => (
              <button key={it.id} onClick={() => setOpen(i)} aria-label={`Ampliar: ${it.title ?? it.category}`}
                className={`group overflow-hidden rounded-3xl ${i % 5 === 0 ? 'row-span-2' : ''}`}>
                <Photo src={it.image_url} alt={it.title ?? it.category} i={i}
                  className={`w-full transition-transform duration-500 group-hover:scale-105 ${i % 5 === 0 ? 'h-full min-h-[18rem]' : 'aspect-square'}`} />
              </button>
            ))}
          </div>
        )}
      </div>
      {open !== null && list[open] && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/85 p-4" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <button className="absolute right-4 top-4 text-white" onClick={() => setOpen(null)} aria-label="Fechar"><X size={28} /></button>
          <button className="absolute left-2 text-white md:left-6" onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label="Anterior"><ChevronLeft size={36} /></button>
          <button className="absolute right-2 text-white md:right-6" onClick={(e) => { e.stopPropagation(); move(1); }} aria-label="Próxima"><ChevronRight size={36} /></button>
          <figure className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <Photo src={list[open].image_url} alt={list[open].title ?? list[open].category} i={open} className="aspect-square w-full rounded-3xl" />
            <figcaption className="mt-3 text-center text-sm text-white/90">{list[open].title ?? list[open].category}</figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

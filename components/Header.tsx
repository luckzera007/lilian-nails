'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const links = [
  ['Início', '#inicio'], ['Sobre', '#sobre'], ['Portfólio', '#portfolio'], ['Serviços', '#servicos'], ['Contato', '#contato'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-sky/30 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Lilian Nails – início">
          <Image src="/logo.png" alt="" width={44} height={44} className="rounded-full mix-blend-multiply" />
          <span className="font-script text-2xl leading-none">Lilian Nails</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Principal">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="text-navy/75 hover:text-navy">{l}</a>
          ))}
          <a href="#agendar" className="btn btn-primary !py-2">Agendar</a>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-sky/30 bg-white px-5 pb-5 md:hidden" aria-label="Principal">
          {[...links, ['Agendar', '#agendar']].map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="block border-b border-sky/20 py-3 text-navy/85">{l}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

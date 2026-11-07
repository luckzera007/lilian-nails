'use client';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase, hasSupabase } from '@/lib/supabase';
import Agenda from '@/components/admin/Agenda';
import ServicesAdmin from '@/components/admin/ServicesAdmin';
import PortfolioAdmin from '@/components/admin/PortfolioAdmin';
import Hours from '@/components/admin/Hours';

const TABS = ['Agenda', 'Serviços', 'Portfólio', 'Horários e site'] as const;

export default function AdminPage() {
  const sb = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Agenda');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  if (!hasSupabase)
    return <main className="mx-auto max-w-lg p-8"><h1 className="font-display text-3xl">Painel</h1><p className="mt-3 text-navy/70">Configure as variáveis do Supabase (.env.local) para ativar o painel. Veja o README.</p></main>;
  if (!ready) return <main className="p-8 text-navy/60">Carregando…</main>;

  if (!session)
    return (
      <main className="grid min-h-screen place-items-center bg-cloud p-5">
        <form className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-soft" onSubmit={async (e) => {
          e.preventDefault(); setError('');
          const { error: err } = await sb!.auth.signInWithPassword({ email, password });
          if (err) setError('E-mail ou senha incorretos.');
        }}>
          <h1 className="font-script text-4xl">Lilian Nails</h1>
          <label className="block text-sm">E-mail<input className="field mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
          <label className="block text-sm">Senha<input className="field mt-1" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <button className="btn btn-primary w-full">Entrar</button>
        </form>
      </main>
    );

  return (
    <main className="min-h-screen bg-cloud">
      <header className="border-b border-sky/40 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <span className="font-script text-3xl">Painel Lilian Nails</span>
          <button className="btn btn-ghost !py-2" onClick={() => sb!.auth.signOut()}><LogOut size={16} /> Sair</button>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5" aria-label="Seções do painel">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} aria-current={tab === t}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm ${tab === t ? 'border-navy font-medium' : 'border-transparent text-navy/60'}`}>{t}</button>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-8">
        {tab === 'Agenda' && <Agenda />}
        {tab === 'Serviços' && <ServicesAdmin />}
        {tab === 'Portfólio' && <PortfolioAdmin />}
        {tab === 'Horários e site' && <Hours />}
      </div>
    </main>
  );
}

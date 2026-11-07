import { getSupabase } from './supabase';
import { DEMO_PORTFOLIO, DEMO_SERVICES, DEMO_SETTINGS } from './demo';
import { PortfolioItem, Service, Settings } from './types';

export type SiteData = { demo: boolean; settings: Settings; services: Service[]; portfolio: PortfolioItem[] };

export async function getSiteData(): Promise<SiteData> {
  const sb = getSupabase();
  if (!sb) return { demo: true, settings: DEMO_SETTINGS, services: DEMO_SERVICES, portfolio: DEMO_PORTFOLIO };
  const [s, sv, p] = await Promise.all([
    sb.from('settings').select('*').eq('id', 1).maybeSingle(),
    sb.from('services').select('*').eq('active', true).order('sort').order('name'),
    sb.from('portfolio').select('*').order('created_at', { ascending: false }),
  ]);
  const settings: Settings = s.data
    ? { ...DEMO_SETTINGS, ...s.data, open_time: String(s.data.open_time).slice(0, 5), close_time: String(s.data.close_time).slice(0, 5) }
    : DEMO_SETTINGS;
  return {
    demo: false,
    settings,
    services: (sv.data ?? []).map((x) => ({ ...x, price: Number(x.price) })),
    portfolio: p.data ?? [],
  };
}

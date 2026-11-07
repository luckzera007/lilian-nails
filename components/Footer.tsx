import { Instagram, MapPin, MessageCircle, Clock } from 'lucide-react';
import { Settings, WEEKDAYS } from '@/lib/types';

export default function Footer({ settings }: { settings: Settings }) {
  const days = [...settings.open_days].sort().map((d) => WEEKDAYS[d].slice(0, 3)).join(', ');
  const wa = settings.whatsapp.replace(/\D/g, '');
  return (
    <footer id="contato" className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-script text-4xl">{settings.studio_name}</p>
          <p className="mt-2 text-sm text-white/70">Nails &amp; Art</p>
        </div>
        <ul className="space-y-3 text-sm text-white/85">
          <li><a className="flex items-center gap-2 hover:text-white" href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer"><Instagram size={16} /> @{settings.instagram}</a></li>
          <li><a className="flex items-center gap-2 hover:text-white" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp</a></li>
          <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {settings.address}</li>
        </ul>
        <p className="flex items-start gap-2 text-sm text-white/85"><Clock size={16} className="mt-0.5 shrink-0" /> {days}, das {settings.open_time} às {settings.close_time}</p>
      </div>
      <p className="border-t border-white/15 py-5 text-center text-xs text-white/60">© {new Date().getFullYear()} {settings.studio_name}. Todos os direitos reservados.</p>
    </footer>
  );
}

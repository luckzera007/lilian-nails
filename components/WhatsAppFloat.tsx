import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat({ phone }: { phone: string }) {
  const text = encodeURIComponent('Olá, Lilian! Vim pelo site e gostaria de saber mais.');
  return (
    <a href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`} target="_blank" rel="noopener noreferrer" aria-label="Conversar no WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm text-white shadow-soft transition-colors hover:bg-navy/90">
      <MessageCircle size={20} /> <span className="hidden sm:inline">Fale comigo</span>
    </a>
  );
}

import { Sparkles } from 'lucide-react';

/** Mostra a foto; sem foto, um espaço delicado pronto para receber a imagem real. */
export default function Photo({ src, alt, className = '', i = 0 }: { src?: string | null; alt: string; className?: string; i?: number }) {
  if (src) return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
  const angle = [135, 200, 160, 110, 250, 180][i % 6];
  return (
    <div
      role="img"
      aria-label={alt}
      className={`grid place-items-center text-navy/30 ${className}`}
      style={{ background: `linear-gradient(${angle}deg, #D6E8F5, #A7C7E7 140%)` }}
    >
      <Sparkles size={28} strokeWidth={1.2} />
    </div>
  );
}

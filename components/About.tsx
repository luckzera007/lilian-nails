import Photo from './Photo';
import { Settings } from '@/lib/types';

export default function About({ settings }: { settings: Settings }) {
  return (
    <section id="sobre" className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[0.8fr_1fr]">
      <Photo src={settings.about_image} alt="Lilian, nail designer" className="mx-auto aspect-[4/5] w-full max-w-sm rounded-t-[999px] rounded-b-3xl shadow-soft" />
      <div>
        <h2 className="font-display text-4xl md:text-5xl">Prazer, eu sou a Lilian</h2>
        <p className="mt-6 max-w-lg whitespace-pre-line leading-relaxed text-navy/80">{settings.about_text}</p>
        <p className="mt-4 max-w-lg leading-relaxed text-navy/80">
          Venha com uma referência, uma cor ou só a vontade de se cuidar. Eu te ajudo a chegar no resultado que combina com a sua rotina.
        </p>
      </div>
    </section>
  );
}

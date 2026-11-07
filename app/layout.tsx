import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lilian Nails – Nails & Art | Nail designer e agendamento online',
  description: 'Alongamento em gel, fibra de vidro, banho de gel, esmaltação em gel e nail art. Veja o portfólio e agende seu horário online.',
  openGraph: { title: 'Lilian Nails – Nails & Art', description: 'Realçando sua beleza em cada detalhe.', locale: 'pt_BR', type: 'website' },
};
export const viewport: Viewport = { themeColor: '#243B53' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Montserrat:wght@400;500;600&family=Pinyon+Script&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

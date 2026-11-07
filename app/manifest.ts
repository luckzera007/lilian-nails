import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lilian Nails – Nails & Art',
    short_name: 'Lilian Nails',
    description: 'Agende seu horário com a Lilian.',
    start_url: '/#agendar',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#243B53',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}

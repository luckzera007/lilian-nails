import { Blocked, Busy, PortfolioItem, Service, Settings } from './types';
import { iso } from './slots';

export const DEMO_SETTINGS: Settings = {
  studio_name: 'Lilian Nails',
  whatsapp: '5541999999999',
  instagram: 'liliannails',
  address: 'Rua das Flores, 123 – Centro, Curitiba/PR',
  open_days: [2, 3, 4, 5, 6],
  open_time: '09:00',
  close_time: '18:00',
  step_min: 30,
  hero_image: null,
  about_image: null,
  about_text:
    'Sou a Lilian, nail designer apaixonada por cuidar de cada detalhe. Aqui você encontra um ambiente tranquilo, materiais de qualidade e um atendimento feito com calma, para que suas unhas fiquem do jeitinho que você imaginou.',
};

export const DEMO_SERVICES: Service[] = [
  { id: 'd1', name: 'Alongamento em gel', description: 'Extensão com molde, estrutura resistente e acabamento natural.', price: 180, duration_min: 150, image_url: null, active: true, sort: 1 },
  { id: 'd2', name: 'Fibra de vidro', description: 'Alongamento leve e flexível, ideal para quem quer unhas finas e duráveis.', price: 200, duration_min: 150, image_url: null, active: true, sort: 2 },
  { id: 'd3', name: 'Banho de gel', description: 'Camada de gel sobre a unha natural para reforçar e proteger.', price: 110, duration_min: 90, image_url: null, active: true, sort: 3 },
  { id: 'd4', name: 'Esmaltação em gel', description: 'Cor intensa e brilho por até 3 semanas, com preparação da cutícula.', price: 70, duration_min: 60, image_url: null, active: true, sort: 4 },
  { id: 'd5', name: 'Nail art', description: 'Desenhos, pedrarias e efeitos personalizados (valor por unha decorada a combinar).', price: 15, duration_min: 30, image_url: null, active: true, sort: 5 },
  { id: 'd6', name: 'Manutenção', description: 'Reposição e correção do alongamento a cada 15 a 20 dias.', price: 120, duration_min: 120, image_url: null, active: true, sort: 6 },
];

const cats = ['Alongamento em gel', 'Fibra de vidro', 'Banho de gel', 'Esmaltação em gel', 'Nail art', 'Manutenção'];
export const DEMO_PORTFOLIO: PortfolioItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: `p${i}`, category: cats[i % cats.length], title: `${cats[i % cats.length]} ${Math.floor(i / cats.length) + 1}`, image_url: null,
}));

function offset(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); }
export const demoBusy = (): Busy[] => [
  { day: offset(1), start_time: '10:00', duration_min: 90 },
  { day: offset(3), start_time: '14:00', duration_min: 150 },
];
export const demoBlocked = (): Blocked[] => [{ id: 'b1', day: offset(5), start_time: null, end_time: null, reason: 'Folga' }];

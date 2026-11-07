export type Service = { id: string; name: string; description: string | null; price: number; duration_min: number; image_url: string | null; active: boolean; sort: number };
export type PortfolioItem = { id: string; category: string; title: string | null; image_url: string | null };
export type Settings = {
  studio_name: string; whatsapp: string; instagram: string; address: string;
  open_days: number[]; open_time: string; close_time: string; step_min: number;
  hero_image: string | null; about_image: string | null; about_text: string;
};
export type Blocked = { id: string; day: string; start_time: string | null; end_time: string | null; reason: string | null };
export type Busy = { day: string; start_time: string; duration_min: number };
export type Booking = {
  id: string; service_id: string | null; service_name: string; day: string; start_time: string;
  duration_min: number; client_name: string; client_phone: string; status: 'pending' | 'confirmed' | 'canceled'; created_at: string;
};
export const CATEGORIES = ['Alongamento em gel', 'Fibra de vidro', 'Banho de gel', 'Esmaltação em gel', 'Nail art', 'Manutenção'];
export const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

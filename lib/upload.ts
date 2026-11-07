import { getSupabase } from './supabase';

/** Envia uma imagem para o bucket público "portfolio" e devolve a URL. */
export async function uploadImage(file: File, folder = 'portfolio'): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase não configurado');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await sb.storage.from('portfolio').upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return sb.storage.from('portfolio').getPublicUrl(path).data.publicUrl;
}

export async function removeImage(url: string | null) {
  const sb = getSupabase();
  const marker = '/object/public/portfolio/';
  if (!sb || !url || !url.includes(marker)) return;
  await sb.storage.from('portfolio').remove([decodeURIComponent(url.split(marker)[1])]);
}

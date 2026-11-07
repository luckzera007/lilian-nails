# Lilian Nails – site, portfólio e agendamento

Next.js 15 + TypeScript + Tailwind + Supabase (banco, Auth e Storage) + Lucide.

## Rodar
1. `npm install`
2. `npm run dev` abre em http://localhost:3000 já em **modo demonstração** (dados fictícios, agendamento não salva).

## Ativar o banco (Supabase)
1. Crie um projeto em supabase.com.
2. SQL Editor → cole e rode `supabase/schema.sql`.
3. Authentication → Users → **Add user** (e-mail e senha da Lilian). Em Authentication → Sign In / Providers, **desative "Allow new users to sign up"** (qualquer usuário logado é administrador).
4. Copie `.env.example` para `.env.local` e preencha a URL e a anon key (Project Settings → API).
5. Reinicie o `npm run dev`. Painel em `/admin`.

## Trocar pelos dados reais
Tudo pelo painel `/admin`: serviços e preços, fotos do portfólio, horários, bloqueios, WhatsApp, Instagram, endereço, textos e fotos principais.

## Deploy
Vercel: importe o repositório e adicione as duas variáveis de ambiente.

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import Booking from '@/components/Booking';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getSiteData } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { demo, settings, services, portfolio } = await getSiteData();
  return (
    <>
      <Header />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Portfolio items={portfolio} />
        <Services services={services} />
        <Booking services={services} settings={settings} demo={demo} />
      </main>
      <Footer settings={settings} />
      <WhatsAppFloat phone={settings.whatsapp} />
    </>
  );
}

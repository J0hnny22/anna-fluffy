import { Footer } from "@/components/Footer";
import { HashScrollFixer } from "@/components/HashScrollFixer";
import { Header } from "@/components/Header";
import { AppointmentBooking } from "@/components/sections/AppointmentBooking";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Process } from "@/components/sections/Process";
import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { structuredData } from "@/data/site";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <Header info={content.businessInfo} />
      <main id="main">
        <Hero info={content.businessInfo} />
        <Intro />
        <Services servicesList={content.services} />
        <ProductCatalog items={content.products} />
        <Process />
        <Team />
        <Gallery items={content.galleryItems} />
        <AppointmentBooking />
        <Reviews items={content.testimonials} />
        <Faq />
        <Contact info={content.businessInfo} />
      </main>
      <Footer info={content.businessInfo} />
      <HashScrollFixer />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}

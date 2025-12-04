import Navbar from '@/app/components/layout/Navbar/Navbar';
import HeroSection from '@/app/components/landing/HeroSection/HeroSection';
import AboutSection from '@/app/components/landing/AboutSection/AboutSection';
import BarbersSection from '@/app/components/landing/BarbersSection/BarbersSection';
import ServicesSection from '@/app/components/landing/ServicesSection/ServicesSection';
import GallerySection from '@/app/components/landing/GallerySection/GallerySection';
import ReviewsSection from '@/app/components/landing/ReviewsSection/ReviewsSection';
import BookingCTASection from '@/app/components/landing/BookingCTASection/BookingCTASection';
import ContactSection from '@/app/components/landing/ContactSection/ContactSection';
import Footer from '@/app/components/layout/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <BarbersSection />
        <ServicesSection />
        <GallerySection />
        <ReviewsSection />
        <BookingCTASection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

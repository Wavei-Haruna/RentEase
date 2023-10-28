import React from 'react';
import Header from '../Components/Header';
import { ActiveRouteProvider } from '../Components/Helpers/Context';
import Hero from '../Components/Page-Sections/Hero';
import WhyUs from '../Components/Page-Sections/WhyUs';
import JoinUs from '../Components/Page-Sections/JoinUs';
import ContactUs from '../Components/Page-Sections/contactUs';
import Footer from '../Components/Page-Sections/Footer';
import HowItWorks from '../Components/Page-Sections/HowItWorks';

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-gray-100">
      <ActiveRouteProvider>
        <Header />
      </ActiveRouteProvider>
      <Hero />
      <WhyUs />
      <HowItWorks />
      <JoinUs />
      <ContactUs />
      <Footer />
    </div>
  );
}

import React from 'react';
import Header from '../Components/Header';
import { ActiveRouteProvider } from '../Components/Helpers/Context';
import Hero from '../Components/Page-Sections/Hero';
import HowItWorks from '../Components/Page_Sections/HowItWorks';
import WhyUs from '../Components/Page-Sections/whyUs';
import JoinUs from '../Components/Page-Sections/JoinUs';
import ContactUs from '../Components/Page-Sections/contactUs';
import GetStarted from '../Components/Modals/getStarted';
import Footer from '../Components/Page-Sections/Footer';

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

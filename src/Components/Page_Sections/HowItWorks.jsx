import React from 'react';
import { FaSearch, FaBook, FaKey, FaHome, FaComments, FaCalendar } from 'react-icons/fa';
import HowItworkItemCard from '../Cards/HowItworkItemCard';
import { cardContainer } from '../Animations/Variance';
import { motion as m } from 'framer-motion';

const HowItWorks = () => {
  return (
    <m.section
      id="how-it-works"
      initial={'hidden'}
      variants={cardContainer}
      whileInView={'show'}
      className="relative my-12 bg-gray-100"
    >
      <div className="container mx-auto ">
        <h2 className="my-6 mb-4 py-4 text-center font-header text-3xl font-semibold text-primary">How It Works</h2>
        <div className=" px-y mx-4 grid gap-10 md:grid-cols-3">
          <HowItworkItemCard
            title={'Browse'}
            icon={FaSearch}
            message={'Explore our Wide Selection of rental properties'}
          />
          <HowItworkItemCard
            title={'Book'}
            icon={FaBook}
            message={'Securely book your preferred space and make payments online.'}
          />

          <HowItworkItemCard
            title={'List'}
            icon={FaHome}
            message={'Create detailed property listings with images and videos for houses, apartments, or hostels.'}
          />
          <HowItworkItemCard
            title={'Connect'}
            icon={FaComments}
            message={'Stay in touch with renters through our in-app messaging system.'}
          />
          <HowItworkItemCard
            title={'Manage'}
            icon={FaCalendar}
            message={'Use the booking calendar to oversee property availability and reservations.'}
          />
          <HowItworkItemCard
            title={'Move In'}
            icon={FaKey}
            message={'Coordinate with the landlord or agent and settle into your new home.'}
          />
        </div>
      </div>
    </m.section>
  );
};

export default HowItWorks;

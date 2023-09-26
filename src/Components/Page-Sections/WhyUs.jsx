import React from 'react';
import { FaHome, FaComments, FaCalendar, FaSearch, FaBook, FaKey } from 'react-icons/fa'; // Import icons
import FeatureCard from '../Cards/whyUsCard';
import { container } from '../Animations/Variance';
import { motion as m } from 'framer-motion';

export default function WhyUs() {
  return (
    <section className=" my-12 bg-secondary ">
      <m.div
        initial={'hidden'}
        variants={container}
        whileInView={'show'}
        id="for-landlords-agents"
        className="relative top-4  mt-12  bg-gray-100 px-8 md:rounded-tr-[30%]"
      >
        {/*  For Renters*/}
        <h2 className="mt-12 py-6 text-center font-header text-2xl font-semibold text-primary md:text-3xl">
          For Renters
        </h2>
        <div className="grid gap-10 md:grid-cols-3 ">
          <FeatureCard
            icon={<FaSearch size={32} />} // Icon component
            title="Explore Variety"
            description="Discover a diverse range of houses, apartments, and hostels tailored to your needs."
          />
          <FeatureCard
            icon={<FaBook size={32} />} // Icon component
            title="Secure Bookings"
            description="Book your chosen space securely online with transparent payment processes."
          />
          <FeatureCard
            icon={<FaKey size={32} />} // Icon component
            title="Review and Rate"
            description="Share your rental experiences with fellow users by leaving reviews and ratings."
          />
        </div>
        {/* For Agents and Landlord */}

        <div className="container mx-auto text-center">
          <h2 className="mt-12 py-6 text-center font-header text-2xl font-semibold text-primary md:text-3xl">
            For Landlords and Agents
          </h2>
          <div className="grid gap-10 md:grid-cols-3 ">
            <FeatureCard
              icon={<FaHome size={32} />} // Icon component
              title="Effortless Listings"
              description="Easily create and manage listings for houses, apartments, or hostels with comprehensive descriptions and multimedia."
            />
            <FeatureCard
              icon={<FaComments size={32} />} // Icon component
              title="Seamless Communication"
              description="Connect with prospective renters through our in-app messaging system."
            />
            <FeatureCard
              icon={<FaCalendar size={32} />} // Icon component
              title="Efficient Bookings"
              description="Manage property availability and reservations efficiently with our user-friendly calendar."
            />
          </div>
        </div>
      </m.div>
    </section>
  );
}

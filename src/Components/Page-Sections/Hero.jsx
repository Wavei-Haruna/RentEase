import React from 'react';
import heroImage from '../../assets/Images/HeroImg.jpeg';
import { motion as m } from 'framer-motion';
import { container, items } from '../Animations/Variance';
import SlideInLeft from '../Animations/SlideInLeft';
import house from '../../assets/Svgs/rent.svg';
import sell from '../../assets/Svgs/sale.svg';
import FloatIcon from '../Animations/FloatIcon';
import SlideIn from '../Animations/SlideIn';

export default function Hero() {
  return (
    <section
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',
      }}
      className="relative top-16 m-0 flex h-screen w-full flex-col items-center  px-3"
    >
      <div className="absolute h-full w-full bg-black bg-opacity-70"></div>

      <FloatIcon className="" x={[0, 500, 700, 300, 0]} y={[600, 200, 400, 300, 0]} duration={30}>
        <img src={house} alt="House SVG " className="Z-10" width={80} height={80} />
      </FloatIcon>
      <FloatIcon className="" x={[50, 100, 300, 600, 0]} y={[0, 200, 300, 200, 0]} duration={30}>
        <img src={sell} alt="House SVG " className="Z-10" width={80} height={80} />
      </FloatIcon>

      <m.div className="z-10 pt-24" variants={container} initial={'hidden'} whileInView={'show'}>
        <SlideInLeft>
          <m.h1 variants={items} className="text-center font-header text-3xl font-bold text-primary md:text-7xl">
            Welcome to RentEase
          </m.h1>
        </SlideInLeft>

        <m.h1 variants={items} className="my-8 text-center font-header text-xl font-bold text-white md:text-2xl">
          Your Gateway to Effortless Rentals
        </m.h1>
        <m.h1 variants={items} className="text-center font-header text-xl font-bold text-white md:text-2xl">
          Discover Your Dream Home Today
        </m.h1>
      </m.div>

      <div className="z-10 ">
        <SlideIn duration={2} delay={1}>
          <h1 className="my-6 mt-12 text-center  font-header text-2xl font-semibold text-primary md:text-3xl">
            About us
          </h1>
        </SlideIn>
        <SlideInLeft duration={2} delay={3}>
          <p className="px-2 text-center font-body text-white md:text-xl">
            At RentEase, we're dedicated to simplifying the rental property experience. <br /> Whether you're a
            landlord, agent, or renter, we've got you covered. <br /> Our platform makes it easy to find, list, and book
            rental properties hassle-free.
          </p>
        </SlideInLeft>
      </div>
    </section>
  );
}

import React from 'react';
import { CardItems } from '../Animations/Variance';
import { motion as m } from 'framer-motion';
import forSale from '../../assets/Svgs/forSale.svg';
import star from '../../assets/Svgs/star.svg';
import circle from '../../assets/Svgs/circle.svg';

export default function HowItworkItemCard({ icon: Icon, title, message }) {
  return (
    <m.div variants={CardItems} initial={'hidden'} whileInView={'show'}>
      <div className=" relative cursor-pointer overflow-hidden rounded-md bg-white p-4 font-body text-gray-500 shadow-lg transition duration-200 ease-out hover:scale-105 hover:bg-primary hover:text-white md:h-[160px] ">
        <div className=" flex items-center ">
          <div className="rounded-full bg-primary p-3 text-white">
            <Icon size={32} />
          </div>

          <h3 className="ml-4 font-header text-xl font-semibold text-secondary">{title}</h3>
        </div>
        <p className="my-2 px-4  hover:text-white">{message}</p>

        <img src={circle} alt="" width={'64'} className="absolute -top-4 right-[30%]  opacity-30 " />
      </div>
    </m.div>
  );
}

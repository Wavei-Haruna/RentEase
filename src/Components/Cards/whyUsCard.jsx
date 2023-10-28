import React from 'react';
import Circle from '../../assets/Images/Animations/circle.mp4';
import { whyUsItems } from '../Animations/Variance';
import { motion as m } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <m.div
      variants={whyUsItems}
      initial={'hidden'}
      whileInView={'show'}
      whileHover={{ scale: 1.02 }}
      className=" relative w-full cursor-pointer overflow-hidden rounded-md  border-l-2 border-secondary bg-transparent p-4 font-body transition  duration-200 ease-out hover:scale-105"
    >
      <video
        src={Circle}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ zIndex: -1 }}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
      ></video>
      <div className="z-10 flex h-full flex-col rounded-lg bg-transparent px-3 py-2">
        <div className=" mb-3 flex flex-col items-center">
          <div className="my-3 h-fit w-fit flex-shrink-0 items-center justify-center rounded-full bg-blue-500 p-2 text-white">
            {icon}
          </div>
          <h2 className="title-font ml-3 font-header text-lg font-semibold text-secondary">{title}</h2>
        </div>
        <div className="flex-grow">
          <p className="font-body text-base leading-relaxed text-text">{description}</p>
        </div>
      </div>
    </m.div>
  );
};

export default FeatureCard;

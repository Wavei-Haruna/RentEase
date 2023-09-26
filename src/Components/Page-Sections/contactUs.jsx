import React from 'react';
import getInTouch from '../../assets/Images/getInTouch.png';
import circle from '../../assets/Svgs/circle.svg';
import FloatIcon from '../Animations/FloatIcon';

export default function ContactUs() {
  return (
    <div className="relative h-screen bg-gray-100 px-4 py-4 md:px-16">
      <h1 className="my-4 h-min py-2 text-center font-header text-2xl font-semibold text-primary md:text-3xl">
        Contact Us
      </h1>
      <div className=" mx-auto  grid h-[80%] gap-10 rounded-xl bg-gray-200 p-4 px-4 shadow-xl md:w-[70%] md:grid-cols-2">
        <form action="" className="w-full">
          <h1 className="text-center font-header text-xl font-semibold text-secondary md:text-2xl">Get Connected</h1>
          {/* Name */}
          <div className="group relative z-0 mb-6 w-full">
            <input
              type="name"
              name="name"
              id="name"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              placeholder=" "
              required
            />
            <label
              htmlFor="name"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Name
            </label>
          </div>
          <div className="group relative z-0 mb-6 w-full">
            <input
              type="email"
              name="email"
              id="email"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Email address
            </label>
          </div>
          {/* Phone */}
          <div className="group relative z-0 mb-6 w-full">
            <input
              type="number"
              name="phone"
              id="phone"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              placeholder=" "
              required
            />
            <label
              htmlFor="phone"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Phone
            </label>
          </div>

          {/* Phone */}
          <div className="group relative z-0 mb-6 w-full">
            <textarea
              name="textArea"
              id="textArea"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              placeholder=" "
              required
            />
            <label
              htmlFor="textArea"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              message
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Submit
          </button>
        </form>
        <div className="aspect-auto  h-full">
          <img src={getInTouch} alt="get in touch Image " className=" mx-auto hidden w-full md:block" />
        </div>
      </div>
      <img src={circle} alt="" width={'64'} height={'64'} className="absolute top-16" />

      <img src={circle} alt="" width={'64'} height={'64'} className="absolute bottom-16 right-8" />
    </div>
  );
}

import { motion as m } from 'framer-motion';
import React, { useState } from 'react';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import GAuth from './gAuth';
import SlideInRight from '../Animations/SlideInRight';

export default function GetStarted({ onClose, openSignIn, openReset }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    remember: false,
  });

  //
  const navigate = useNavigate();
  const { first_name, last_name, email, password, remember } = formData;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };
  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Do something with formData, like sending it to the server

    try {
      const auth = getAuth();

      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      updateProfile(auth.currentUser, {
        displayName: `${first_name} ${last_name}`,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();
      console.log(formDataCopy);

      // sending the the date to firebase using setDoc.
      await setDoc(doc(db, 'users', user.uid), formDataCopy);
      navigate('/profile');

      toast.success('Sign up successful');
    } catch (error) {
      if (password.length > 6) toast.error('oops password must have at least 6 characters');
      else toast.error('oops therfe is an error');
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'circIn' }}
      exit={{ opacity: 0 }}
      className="h-modal  fixed left-0 right-0 top-[5vh] z-50 mx-4 flex w-screen items-center justify-center overflow-y-auto overflow-x-hidden bg-black  bg-opacity-70 md:inset-0 md:h-full"
    >
      <div className="relative  z-10 w-fit rounded-lg bg-white p-4 shadow  sm:p-5 md:w-1/2">
        <AiOutlineCloseSquare
          size={32}
          className="absolute right-2 top-1 text-primary hover:scale-105 hover:text-other"
          onClick={onClose}
        />

        <SlideInRight duration={0.5}>
          <form
            className="mt-8  "
            action="#"
            onSubmit={(e) => {
              handleSubmit(e);
              onClose;
            }}
          >
            {/* first name */}
            <div className="my-6 grid gap-x-10 gap-y-3 lg:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  className="block w-full rounded-full border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="first name"
                  value={first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* last name */}
              <div>
                <label htmlFor="last_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  className="block w-full rounded-full border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="last name"
                  value={last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full rounded-full border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="block w-full rounded-full border border-gray-300 bg-gray-50 p-2.5 text-sm  text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  value={password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            {/* remember me section */}

            <div className=" grid grid-cols-2 items-start">
              <div className="mb-4 flex h-5 items-center space-x-6">
                <label htmlFor="remember" className="font-medium text-gray-500 dark:text-gray-400">
                  Remember me
                </label>
                <input
                  id="remember"
                  aria-describedby="remember"
                  name="remember"
                  type="checkbox"
                  className="focus:ring-3 h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  checked={remember}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <a
                href="#"
                className="ml-auto cursor-pointer text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                onClick={openReset}
              >
                Lost Password?
              </a>
            </div>

            <div className="grid w-full gap-x-10 md:grid-cols-2 ">
              <button
                type="submit"
                className="w-full rounded-full  bg-primary px-5 py-2 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-primary dark:focus:ring-blue-800"
              >
                Sign Up
              </button>
              <GAuth />
            </div>
            <div className="my-6 text-sm font-medium text-gray-900 dark:text-white">
              Have an account?
              <a
                className="ml-3 cursor-pointer font-body text-blue-600 hover:underline dark:text-blue-500 "
                onClick={openSignIn}
              >
                Sign In
              </a>
            </div>
          </form>
        </SlideInRight>
      </div>
    </m.div>
  );
}

//

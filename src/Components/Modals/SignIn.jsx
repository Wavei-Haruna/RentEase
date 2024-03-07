import { motion as m } from 'framer-motion';
import React, { useState } from 'react';
import { AiOutlineCloseSquare } from 'react-icons/ai';

import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

export default function SignIn({ onClose, openSignUp, openReset }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const Navigate = useNavigate();

  const { email, password, remember } = formData;

  const handleChange = (e) => {
    const { value, name, checked, type } = e.target;
    const inputValue = type == 'checkbox' ? checked : value;

    // update the login value.
    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      if (userCredentials.user) {
        Navigate('/profile');
        toast.success('Done');
      }
    } catch (error) {
      toast.error('oops something went wrong');
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'circIn' }}
      exit={{ opacity: 0 }}
      className="h-modal  fixed left-0 right-0 top-[10vh] z-50 mx-4 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-70  md:inset-0 md:h-full"
    >
      <div className="relative top-[19vh] z-10 w-fit rounded-lg bg-white p-4  shadow sm:p-5">
        <AiOutlineCloseSquare
          size={32}
          className="absolute right-2 top-1 text-primary hover:scale-105 hover:text-other"
          onClick={onClose}
        />

        <form
          className="mt-8 space-y-6"
          action="#"
          onSubmit={(e) => {
            handleSubmit(e);
            onClose;
          }}
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="example@gmail.com"
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
              value={password}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="remember"
                aria-describedby="remember"
                name="remember"
                type="checkbox"
                className="focus:ring-3 h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                value={remember}
                onChange={handleChange}
              />
            </div>
            <div className="mx-3 text-sm">
              <label htmlFor="remember" className="font-medium text-gray-500 dark:text-gray-400">
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="ml-auto cursor-pointer text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
              onClick={openReset}
            >
              Lost Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Sign In
          </button>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Not registered yet?{' '}
            <a className="ml-3 cursor-pointer text-blue-600 hover:underline dark:text-blue-500" onClick={openSignUp}>
              Create account
            </a>
          </div>
        </form>
      </div>
    </m.div>
  );
}

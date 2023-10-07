import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { motion as m } from 'framer-motion';
import React, { useState } from 'react';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import { toast } from 'react-toastify';

export default function Reset({ onClose, openSignUp, openSignIn }) {
  const [formData, setFormData] = useState({
    email: '',
    remember: false,
  });

  // lets handle the onchnage
  const onChange = (e) => {
    e.preventDefault();
    const { name, type, checked, value } = e.target;
    const inputType = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: inputType,
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast.success('reset link sent ');
    } catch (error) {
      toast.error('oops there is an error sending Link');
    }
  };
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'circIn' }}
      exit={{ opacity: 0 }}
      className="h-modal fixed left-0 right-0 top-[10vh] z-50 mx-4 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-70  md:inset-0 md:h-full"
    >
      <div className="relative top-[19vh] z-10 w-fit rounded-lg bg-white p-4  shadow sm:p-5">
        <AiOutlineCloseSquare
          size={32}
          className="absolute right-2 top-1 text-primary hover:scale-105 hover:text-other"
          onClick={onClose}
        />

        <form className="mt-8 space-y-6" action="#" onSubmit={handleFormSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={onChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="example@gmail.com"
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
                value={formData.remember}
                onChange={onChange}
                className="focus:ring-3 h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                required
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
              onClick={openSignIn}
            >
              Sign In
            </a>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Reset
          </button>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Not registered yet?{' '}
            <a className="ml-3 cursor-pointer text-blue-600 hover:underline dark:text-blue-500" onClick={openSignUp}>
              Register
            </a>
          </div>
        </form>
      </div>
    </m.div>
  );
}

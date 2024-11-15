import React, { useContext, useEffect, useState } from 'react';
import Logo from './Logo';
import { PiPaperPlane } from 'react-icons/pi';
import HamburgerMenu from './HamburgerMenu';
import NavBar from './Navbar';
import { navContext } from './Helpers/Context';
import { AnimatePresence } from 'framer-motion';
import SignIn from './Modals/SignIn';
import Reset from './Modals/Reset';
import { useAuthHook } from '../App/Hooks/useAuthHook';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Header() {
  const [signInModal, setSignInModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const { setIsActive, showMenu, setShowMenu } = useContext(navContext);
  const { isLoggedIn } = useAuthHook();
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if logged in and not already on /profile
    if (isLoggedIn && location.pathname !== '/profile') {
      console.log('Redirecting to /profile'); // Add logging to track flow
      navigate('/profile');
    }
  }, []); // Dependency on location.pathname

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast('You have been logged out.');
      navigate('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 w-full">
        <nav className="flex h-[14vh] border-gray-200 bg-white px-4 py-4 shadow-sm lg:px-6 lg:py-0">
          <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between font-body">
            <Logo />
            <div className="flex items-center lg:order-2">
              {isLoggedIn ? (
                <>
                  <button
                    className="mr-2 rounded-lg  px-4 py-2 font-medium text-primary duration-300 hover:scale-105 hover:cursor-pointer hover:bg-secondary focus:outline-none focus:ring-4 lg:px-5 lg:py-2.5"
                    onClick={() => navigate('/profile')}
                  >
                    Dashboard
                  </button>
                  <button
                    className="mr-2 rounded-lg  px-4 py-2 font-medium text-yellow-600 duration-300 hover:scale-105 hover:cursor-pointer hover:bg-secondary focus:outline-none focus:ring-4 lg:px-5 lg:py-2.5"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  data-modal-target="authentication-modal"
                  data-modal-toggle="authentication-modal"
                  className="mr-2 hidden rounded-lg bg-primary px-4 py-2 font-medium text-white duration-300 hover:scale-105 hover:cursor-pointer hover:bg-secondary focus:outline-none focus:ring-4 lg:px-5 lg:py-2.5"
                  onClick={(e) => {
                    navigate('/register-with-rent-ease');
                  }}
                >
                  Get Started
                  <PiPaperPlane className="ml-2 inline-block rotate-90" />
                </a>
              )}
              <HamburgerMenu showMenu={showMenu} setShowMenu={setShowMenu} />
            </div>
            <NavBar />
          </div>
          
          <AnimatePresence>
            {signInModal && (
              <SignIn
                onClose={() => setSignInModal(false)}
                openSignUp={() => {
                  setSignInModal(false);
                  setSignUpModal(true);
                }}
                openReset={() => {
                  setSignInModal(false);
                  setResetModal(true);
                }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {resetModal && (
              <Reset
                onClose={() => setResetModal(false)}
                openSignUp={() => {
                  setResetModal(false);
                  setSignUpModal(true);
                }}
                openSignIn={() => {
                  setSignInModal(true);
                  setResetModal(false);
                }}
              />
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
}

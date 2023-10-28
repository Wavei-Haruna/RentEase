import React, { useContext, useState } from 'react';
import Logo from './Logo';
import { PiPaperPlane } from 'react-icons/pi';
import HamburgerMenu from './HamburgerMenu';
import NavBar from './Navbar';
import { navContext } from './Helpers/Context';
import GetStarted from './Modals/getStarted';
import { AnimatePresence } from 'framer-motion';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import SignIn from './Modals/SignIn';
import Reset from './Modals/Reset';

export default function Header() {
  const [signInModal, setSignInModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const { setIsActive, showMenu, setShowMenu } = useContext(navContext);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 w-full ">
        <nav className="flex h-[14vh]  border-gray-200 bg-white px-4 py-4  shadow-sm lg:px-6 lg:py-0 ">
          <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between font-body">
            <Logo />
            <div className="flex items-center lg:order-2">
              <a
                data-modal-target="authentication-modal"
                data-modal-toggle="authentication-modal"
                className="mr-2 rounded-lg bg-primary px-4 py-2 font-medium text-white duration-300 hover:scale-105 hover:cursor-pointer hover:bg-secondary focus:outline-none focus:ring-4 lg:px-5 lg:py-2.5 "
                onClick={(e) => {
                  e.preventDefault();
                  setSignUpModal(true);
                }}
              >
                Get Started <PiPaperPlane className="ml-2 inline-block rotate-90 " />
              </a>
              <HamburgerMenu showMenu={showMenu} setShowMenu={setShowMenu} />
            </div>

            <NavBar />
          </div>
          <AnimatePresence>
            {signUpModal && (
              <GetStarted
                onClose={() => setSignUpModal(false)}
                openSignIn={() => {
                  setSignInModal(true);
                  setSignUpModal(false);
                }}
                openReset={() => {
                  setSignUpModal(false);
                  setResetModal(true);
                }}
              />
            )}
          </AnimatePresence>
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
          {/* Reset Modal */}
          <AnimatePresence>
            {resetModal && (
              <Reset
                onClose={() => setResetModal(false)}
                openSignUp={() => {
                  setResetModal(false);
                  setSignUpModal(true);
                  console.log("I've been clicked");
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

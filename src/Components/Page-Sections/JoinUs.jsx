import React, { useReducer } from 'react';
import { PiPaperPlane } from 'react-icons/pi';
import SlideInLeft from '../Animations/SlideInLeft';
import SlideInRight from '../Animations/SlideInRight';
import addUser from '../../assets/Images/Animations/addUser.gif';
import GetStarted from '../Modals/getStarted';

import { AnimatePresence } from 'framer-motion';
import Reset from '../Modals/Reset';
import SignIn from '../Modals/SignIn';

export default function JoinUs() {
  // Register modal reducer
  const modalReducer = (state, action) => {
    switch (action.type) {
      case 'OPEN_SIGN_IN':
        return { ...state, signInModal: true, signUpModal: false, resetModal: false };
      case 'CLOSE_SIGN_IN':
        return { ...state, signInModal: false };
      case 'OPEN_SIGN_UP':
        return { ...state, signUpModal: true, signInModal: false, resetModal: false };
      case 'CLOSE_SIGN_UP':
        return { ...state, signUpModal: false };
      case 'OPEN_RESET':
        return { ...state, resetModal: true, signInModal: false, signUpModal: false };
      case 'CLOSE_RESET':
        return { ...state, resetModal: false };
      default:
        return state;
    }
  };

  const [modalState, dispatch] = useReducer(modalReducer, {
    signInModal: false,
    signUpModal: false,
    resetModal: false,
  });

  return (
    <div className="my-12 bg-other">
      <div className="relative grid w-full gap-5 bg-gray-100 px-4 md:mx-4 md:grid-cols-2 md:rounded-l-[70%]">
        <div className="md: flex flex-col items-center justify-center ">
          <SlideInLeft duration={3} initialX={'-100%'} afterX={'0%'}>
            <h1 className="my-3 font-header  text-3xl font-semibold text-primary  md:text-3xl">
              Join the <span className="font-header font-semibold text-primary">Rent</span>
              <span className="font-header font-semibold text-secondary">Ease </span> Community
            </h1>
          </SlideInLeft>

          <SlideInRight>
            <p className="my-4 ml-4 h-full border-l-2 border-secondary px-3 font-body text-xl text-text">
              Ready to simplify your rental experience? Join{' '}
              <span className="font-header font-semibold text-primary">Rent</span>
              <span className="font-header font-semibold text-secondary">Ease </span> and discover a world of
              convenience and ease.
            </p>
          </SlideInRight>
          <SlideInLeft delay={1} duration={2}>
            <button className="my-4">
              <a
                className="mr-2 rounded-lg bg-primary px-4 py-2 font-medium text-white duration-300 hover:scale-105 hover:cursor-pointer hover:bg-secondary focus:outline-none focus:ring-4 lg:px-5 lg:py-2.5 "
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ type: 'OPEN_SIGN_UP' });
                }}
              >
                Get Started <PiPaperPlane className="ml-2 inline-block rotate-90 hover:scale-105 " />
              </a>
            </button>
          </SlideInLeft>
        </div>
        <SlideInRight>
          <div>
            <img src={addUser} alt="" className="w-full cursor-pointer" />
          </div>
        </SlideInRight>
      </div>

      <AnimatePresence>
        {modalState.signUpModal && (
          <GetStarted
            onClose={() => dispatch({ type: 'CLOSE_SIGN_UP' })}
            openSignIn={() => dispatch({ type: 'OPEN_SIGN_IN' })}
            openReset={() => dispatch({ type: 'OPEN_RESET' })}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalState.signInModal && (
          <SignIn
            onClose={() => dispatch({ type: 'CLOSE_SIGN_IN' })}
            openSignUp={() => dispatch({ type: 'OPEN_SIGN_UP' })}
            openReset={() => dispatch({ type: 'OPEN_RESET' })}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalState.resetModal && (
          <Reset
            onClose={() => dispatch({ type: 'CLOSE_RESET' })}
            openSignUp={() => dispatch({ type: 'OPEN_SIGN_UP' })}
            openSignIn={() => dispatch({ type: 'OPEN_SIGN_IN' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

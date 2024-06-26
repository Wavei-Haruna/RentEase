import React from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { FaGoogle } from 'react-icons/fa';


export default function GAuth() {


  const navigate = useNavigate()
  const handleSignInWithGoogleProvider = ()=>{

const auth = getAuth();
const provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)
.then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    navigate("/profile");
     toast.success("Welcome Back");

    const user = result.user;
  

  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

  }
  return (
<div className='flex ml-4 justify-center items-center'>
            <p className='font-menu font-semibold'> or continue with</p>
            <button onClick={handleSignInWithGoogleProvider} className='w-full rounded-sm mx-4 bg-primary py-2 text-center px-5 text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-primary dark:focus:ring-blue-800 sm:w-auto'>
            <FaGoogle className='ml-2 cursor-pointer text-white text-2xl'/>  </button>
          </div>
  )
}

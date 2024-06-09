import React from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";


export default function GAuth() {

  const handleSignInWithGoogleProvider = ()=>{

const auth = getAuth();
const provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)
.then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
   
    const user = result.user;
    console.log("Hello World")

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
            <FcGoogle className='ml-2 cursor-pointer text-2xl'onClick={handleSignInWithGoogleProvider}/>
          </div>
  )
}

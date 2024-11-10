import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { FaGoogle } from 'react-icons/fa';

export default function GAuth() {
  const navigate = useNavigate();

  const handleSignInWithGoogleProvider = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken; // This is the OAuth access token
        const user = result.user; // This is the signed-in user

        // You can use the token for further API requests if needed
        console.log('Access Token:', token);
        console.log('User  Info:', user);

        // Navigate to the profile page and show a success message
        navigate('/profile');
        toast.success('Welcome Back, ' + user.displayName); // Use user's display name in the toast
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email; // The email of the user's account used.
        const credential = GoogleAuthProvider.credentialFromError(error); // The AuthCredential type that was used.

        // Log the error information for debugging
        console.error('Error Code:', errorCode);
        console.error('Error Message:', errorMessage);
        console.error('Email:', email);

        // Show error message to the user
        toast.error('Authentication failed: ' + errorMessage);
      });
  };

  return (
    <div className="items-center md:flex">
      <p className="my-3 text-center font-menu font-semibold"> or signup with</p>
      <button
        onClick={handleSignInWithGoogleProvider}
        className="flex w-full justify-center rounded-full bg-red-500 px-5 py-2 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-primary dark:focus:ring-blue-800"
      >
        <FaGoogle className="ml-2 cursor-pointer text-2xl text-white" />
      </button>
    </div>
  );
}

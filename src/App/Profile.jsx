import { getAuth, updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaEdit } from 'react-icons/fa'; //
import { BiHome } from 'react-icons/bi'; //
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import Spinner from './Spinner';
import CreateListing from './CreateListing';
export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    userName: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const { email, first_name, last_name, userName } = formData;
  const [isUpdating, setIsUpdating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData({
          userName: user?.displayName || 'Name',
          email: user?.email || 'Email',
        });
      }
    });

    // Clean up the subscription to avoid memory leaks
    return () => unsubscribe();
  }, [auth]);

  // update the user Info.
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    console.log(isUpdating);
    try {
      if (auth.currentUser.displayName !== `${first_name} ${last_name}`) {
        await updateProfile(auth.currentUser, {
          displayName: `${first_name} ${last_name}`,
        });
        setFormData({
          userName: auth?.currentUser.displayName,
        });
      }
      // updating the name in fireStore
      // now create the docRef and use it to update the doc.
      const docRef = doc(db, 'users', auth.currentUser.uid);
      // now lets update the doc.
      await updateDoc(docRef, {
        first_name: first_name,
        last_name: last_name,
      });

      toast.success('Profile updated');

      setIsEditing(false);
      setIsUpdating(false);
    } catch (error) {
      console.error('Error updating profile: ', error);
      toast.error('error updating profile');
      console.log(first_name, last_name);
    }
  };
  //  Sign out functionality.

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      toast.success('Signed Out');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="max-h-1/2 w-screen bg-gray-100">
      <h1 className="relative top-6 mx-auto mb-4 w-fit rounded-lg border-l-4 border-r-4 border-secondary px-2 font-header text-3xl font-bold text-gray-400">
        Profile
      </h1>

      {isUpdating && (
        <div className="absolute top-0 z-10 m-0 flex h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-70">
          <Spinner />
        </div>
      )}
      <div className="relative mt-10  grid w-full grid-cols-1 gap-4 md:grid-cols-2 ">
        <div className="rounded-lg p-6 font-menu text-gray-500 shadow-md">
          <h3 className="mb-2 text-xl font-semibold">Settings</h3>
          {isEditing ? (
            <form onSubmit={handleFormSubmit} className="mb-4">
              <div className="mb-4 flex items-center">
                <input
                  type="text"
                  name="first_name"
                  value={first_name}
                  placeholder={userName.split(' ')[0]}
                  onChange={handleInputChange}
                  className="border-b-2 border-blue-500 text-lg focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="text"
                  name="last_name"
                  value={last_name}
                  placeholder={userName.split(' ')[1]}
                  onChange={handleInputChange}
                  className="border-b-2 border-blue-500 text-lg focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  className="border-b-2 border-blue-500 text-lg focus:outline-none"
                  required
                />
              </div>
              <button type="submit" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                Save
              </button>
            </form>
          ) : (
            <>
              <div className="mb-4 flex items-center">
                <p className="text-lg">{userName}</p>
              </div>
              <div className="mb-4 flex items-center">
                <FaEnvelope className="mr-2 text-2xl text-blue-500" />
                <p className="text-lg">{email}</p>
              </div>
            </>
          )}
          <div className="flex space-x-10">
            <button className="my-2 flex items-center" onClick={() => setIsEditing(!isEditing)}>
              <FaEdit className="mr-2 cursor-pointer text-2xl text-blue-500" />
              <p className="text-lg">Edit</p>
            </button>
            <button className="my-2 flex cursor-pointer items-center duration-200 ease-out" onClick={handleSignOut}>
              <p className="text-lg text-text"> Sign out</p>
            </button>
          </div>
        </div>
        <div className="mx-auto flex ">
          <CreateListing />
        </div>
      </div>
    </section>
  );
}

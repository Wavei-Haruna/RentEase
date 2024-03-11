import { getAuth, updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { FaUser, FaUserGear } from 'react-icons/fa6';

import { FiMessageSquare } from 'react-icons/fi';
import { FaUserEdit } from 'react-icons/fa'; //
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import Spinner from './Spinner';
import CreateListing from './CreateListing';
import GetListings from './GetListings';
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
  const [createListings, setCreateListings] = useState(false);
  const [fetchedListingsData, setFetchedListingsData] = useState(null);

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
  // The Data flows from the child comp to the parent,
    const onListingsDataFetched = (data) =>{
      setFetchedListingsData(data)
    }

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
    <section className="w-full relative overflow-x-hidden bg-gray-200 px-3">
      <h1 className="relative top-6 mx-auto my-2 w-fit rounded-lg border-l-4 border-r-4 border-secondary px-2 font-header text-3xl font-bold text-gray-600">
        Profile
      </h1>

      {isUpdating && (
        <div className="absolute top-0 z-10 m-0 flex h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-70">
          <Spinner />
        </div>
      )}
      <div className=" mt-10 px-2  grid max-w-6xl mx-auto grid-cols-1 gap-4 md:grid-cols-2 shadow-md my-3 ">
        <div className="h-fit  p-6 font-menu text-gray-500 ">
          <h3 className="spa mb-2 flex text-xl font-semibold">
            <FaUserGear className="mr-2 w-8" /> Settings
          </h3>
          {isEditing ? (
            <form onSubmit={handleFormSubmit} className="mb-4">
              <div className="mb-4 flex items-center ">
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
                <FaUser className="mr-2 text-gray-500" />
                <p className="text-lg uppercase">{userName}</p>
              </div>
              <div className="mb-4 flex items-center">
                <FiMessageSquare className="mr-2 text-2xl text-gray-500" />
                <p className="text-lg">{email}</p>
              </div>
            </>
          )}
          <div className="flex  items-center justify-between w-3/4 p-1">
            <button className="my-2 flex items-center justify-center hover:scale-105 rounded-sm bg-primary px-2 py-1 ml-8" onClick={() => setIsEditing(!isEditing)}>
              <FaUserEdit className="mr-2 cursor-pointer text-xl text-white " />
              <p className="text-white ">Edit</p>
            </button>
            <button className="my-2 flex cursor-pointer rounded-sm py-1 hover:scale-105 items-center bg-[#8B0000] px-2 duration-200 ease-out" onClick={handleSignOut}>
              <p className=" font-semibold text-white"> Sign out</p>
            </button>
          </div>
        </div>
        <div className="w-full  ">
          <div className="flex w-full justify-center z-50">
            <button
              className="mx-2 cursor-pointer rounded-sm bg-blue-500 p-2 font-menu uppercase text-white transition-all ease-in-out hover:bg-secondary"
              onClick={() => setCreateListings(!createListings)}
            >
              {createListings ? 'Close' : 'Create Listing'}
            </button>
          </div>

          <div >    
      {fetchedListingsData && (
        <div>
          <h3 className="my-2 font-header font-semibold text-[#767676]">
            Total Listings created: {fetchedListingsData.totalListings}
          </h3>
          <h3 className="my-2 ml-6 font-header font-semibold text-[#767676]">
            For Sale: {fetchedListingsData.listingsForSale}
          </h3>
          <h3 className=" my-2 ml-6 font-header font-semibold text-[#767676]">
            Total Rent: {fetchedListingsData.listingsForRent}
          </h3>
          <h3 className=" my-2 ml-6 font-header font-semibold text-[#767676]">
            {/* Sold Listings: {fetchedListingsData.soldListings} */}
          </h3>
          <h3 className=" my-2 ml-6 font-header font-semibold text-[#767676]">
            {/* Rented Listings: {fetchedListingsData.rentedListings} */}
          </h3>
        </div> )}
          </div>
       
        </div>
      </div>
     
     <div className="max-w-6xl  mx-auto">   {createListings ? <CreateListing />:<GetListings onListingsDataFetched={onListingsDataFetched}/>
}</div>
    </section>
  );
}

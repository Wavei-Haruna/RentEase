import { getAuth, updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect, useReducer } from 'react';
import { FaUser, FaUserGear } from 'react-icons/fa6';

import { FiMessageSquare } from 'react-icons/fi';
import { FaBell, FaPlusCircle, FaUserEdit } from 'react-icons/fa'; //
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import Spinner from './Spinner';
import CreateListing from './CreateListing';
import GetListings from './GetListings';
import { MdMessage, MdReviews } from 'react-icons/md';
import Notifications from './Hooks/Notifications';
import Reviews from './Reviews';
import Messages from './Messages';
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
  //  actions on dashboard
  const actionTypes = {
    showMe: "showMe",
    showCreateListings: "showCreateListings",
    showNotifications : "showNotifications",
    showReviews: "showReviews",
    showMessages: "showMessages",
    
  }
  // Lets now work on the initial states
  const initialState = {
    showMe: true,
    showCreateListings:false,
    showNotifications: false,
    showReviews: false,
    showMessages: false,
  }

  const reducer= (state, action) => {
    switch(action.type){
      case actionTypes.showMe: return{
        ...initialState, showMe:true,
      }
      case actionTypes.showCreateListings: return{
        ...initialState, showCreateListings:true,showMe:false,
      }
      case actionTypes.showNotifications: return{
        ...initialState, showNotifications:true,showMe:false,
      }
      case actionTypes.showReviews: return{
        ...initialState, showReviews:true, showMe:false,
      }
      case actionTypes.showMessages: return {
        ...initialState, showMessages:true, showMe:false,
      
      }
      default: return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleDashBoardItemClick = (actionType) =>
  {
    dispatch({type:actionType})
  }


  return (
    <section className="w-full relative overflow-x-hidden bg-gray-200 px-3">
     
      {isUpdating && (
        <div className="absolute top-0 z-10 m-0 flex h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-70">
          <Spinner />
        </div>
      )}

     {/* Sub Menus */}
     <div className='grid md:grid-cols-3  w-full h-[50vh]'>
     <div className='bg-white py-2 px-3 font-menu text-gray-500 relative'>
     <h1 className="relative  mx-auto my-2 w-fit rounded-lg border-l-4 border-r-4 border-secondary px-2 font-header text-xl font-bold text-gray-600">
        Profile
      </h1>
     <button className='flex items-center font-menu font-semibold' onClick={ ()=> handleDashBoardItemClick(actionTypes.showMe)}> <FaUserGear className="mr-2 w-8 text-secondary"  /> Me</button>
     <button className='flex  items-center transition-all ease-in-out duration-200  my-3 font-menu font-semibold' onClick={ ()=> handleDashBoardItemClick(actionTypes.showCreateListings)}> <FaPlusCircle className="mr-2 w-8 text-primary"  /> Create Listings</button>
     <button className='flex  items-center transition-all ease-in-out duration-200  my-3 font-menu font-semibold' onClick={ ()=> handleDashBoardItemClick(actionTypes.showNotifications)}> <FaBell className="mr-2 w-8 text-primary"  /> Notifications</button>
     <button className='flex  items-center transition-all ease-in-out duration-200  my-3 font-menu font-semibold' onClick={ ()=> handleDashBoardItemClick(actionTypes.showReviews)}> <MdReviews className="mr-2 w-8 text-other"  /> Reviews</button>
     <button className='flex  items-center transition-all ease-in-out duration-200  my-3 font-menu font-semibold' onClick={ ()=> handleDashBoardItemClick(actionTypes.showMessages)}> <MdMessage className="mr-2 w-8 text-primary"  /> Messages</button>

     </div>

     <div className='bg-gray-300 md:col-span-2 h-[300px] p-2 overflow-hidden ' >
     {state.showMe && <> {isEditing ? (
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
          <div className="flex  items-center transition-all ease-in-out duration-200  justify-between w-3/4 p-1">
            <button className="my-2 flex items-center justify-center hover:scale-105 rounded-sm bg-primary px-2 py-1 ml-8" onClick={() => setIsEditing(!isEditing)}>
              <FaUserEdit className="mr-2 cursor-pointer text-xl text-white " />
              <p className="text-white ">Edit</p>
            </button>
            <button className="my-2 flex cursor-pointer rounded-sm py-1 hover:scale-105 items-center bg-[#8B0000] px-2 duration-200 ease-out" onClick={handleSignOut}>
              <p className=" font-semibold text-white"> Sign out</p>
            </button>
          </div></>}
    
          {/* Sow Create Listings */}
      {state.showCreateListings &&   <div className="w-full transition-all ease-in-out duration-200 ">
          <div className="flex w-full justify-center z-50">
            <button
              className="mx-2 cursor-pointer rounded-sm bg-blue-500 p-2 font-menu uppercase text-white transition-all ease-in-out hover:bg-secondary"
              onClick={() => setCreateListings(!createListings)}
            >
              {createListings ? 'Close' : 'Create Listing'}
            </button>
          </div>
          
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
}
{/* Show Motifications */}

{state.showNotifications && <Notifications />}
{state.showReviews && <Reviews />}
{state.showMessages && <Messages />}
     </div>
     
     </div>
     <div className="max-w-6xl  mx-auto relative top-[300px]  md:top-4 my-12">   {createListings ? <CreateListing />:<GetListings onListingsDataFetched={onListingsDataFetched}/>
}</div>
    </section>
  );
}

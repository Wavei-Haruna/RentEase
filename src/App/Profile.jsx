import { getAuth, updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect, useReducer } from 'react';
import { FaGear, FaUserGear } from 'react-icons/fa6';
import { FiMessageSquare } from 'react-icons/fi';
import { FaBell, FaList, FaPlusCircle, FaUserEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import Spinner from './Spinner';
import { MdMenu, MdMessage, MdReviews } from 'react-icons/md';
import Notifications from './Hooks/Notifications';
import Reviews from './Reviews';
import Messages from './Messages';
import MyListings from './Hooks/MyListings';

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { first_name, last_name, userName, email } = formData;

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

    return () => unsubscribe();
  }, [auth]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      if (auth.currentUser.displayName !== `${first_name} ${last_name}`) {
        await updateProfile(auth.currentUser, {
          displayName: `${first_name} ${last_name}`,
        });
        setFormData({
          userName: auth?.currentUser.displayName,
        });
      }
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, {
        first_name: first_name,
        last_name: last_name,
      });

      toast.success('Profile updated');

      setIsEditing(false);
      setIsUpdating(false);
    } catch (error) {
      console.error('Error updating profile: ', error);
      toast.error('Error updating profile');
    }
  };

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

  const actionTypes = {
    showSettings: 'showSettings',
    showMyListings: 'showMyListings',
    showNotifications: 'showNotifications',
    showReviews: 'showReviews',
    showMessages: 'showMessages',
  };

  const initialState = {
    showSettings: true,
    showMyListings: false,
    showNotifications: false,
    showReviews: false,
    showMessages: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case actionTypes.showSettings:
        return {
          ...initialState,
          showSettings: true,
        };
      case actionTypes.showMyListings:
        return {
          ...initialState,
          showMyListings: true,
        };
      case actionTypes.showNotifications:
        return {
          ...initialState,
          showNotifications: true,
        };
      case actionTypes.showReviews:
        return {
          ...initialState,
          showReviews: true,
        };
      case actionTypes.showMessages:
        return {
          ...initialState,
          showMessages: true,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleDashBoardItemClick = (actionType) => {
    dispatch({ type: actionType });
  };

  return (
    <section className="w-full relative overflow-x-hidden bg-gray-200">
      {isUpdating && (
        <div className="absolute top-0 z-10 m-0 flex h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-70">
          <Spinner />
        </div>
      )}
      <header className={`fixed top-0 z-50 w-full bg-primary px-8 py-2 flex justify-between items-center ${sidebarOpen ? 'ml-72' : ''}`}>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-500 hover:bg-gray-700 transition-all ease-in-out duration-200"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MdMenu className="text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white font-header">Profile</h1>
      </header>
      <div className={`fixed top-0 flex flex-col justify-between items-center z-40 left-0 w-72 h-screen bg-white shadow-md transition-all ease-in-out duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='w-full bg-[#f0f0f0] text-primary'>
          <h3 className="flex gap-2 justify-center items-center my-3 font-menu text-gray-white px-4 py-2 transition-all ease-in-out duration-200">
            <FaUserGear size={44} className="mr-2 bg-primary rounded-full p-1 w-fit text-white" />
            {userName}
          </h3>
          <h3 className='my-3 font-semibold md:text-xl text-center font-header'>Welcome Dashboard</h3>
        </div>
        <ul className="list-none px-6">
          <li>
            <button
              className="flex gap-2 justify-center items-center my-3 font-menu text-gray-800 px-4 py-2 hover:bg-secondary rounded-md transition-all ease-in-out duration-200"
              onClick={() => handleDashBoardItemClick(actionTypes.showMyListings)}
            >
              <FaList size={24} className="mr-2 bg-primary rounded-full p-1 w-fit text-white" />
              My Listings
            </button>
          </li>
          <li>
            <button
              className="flex gap-2 justify-center items-center my-3 font-menu text-gray-800 px-4 py-2 hover:bg-secondary rounded-md transition-all ease-in-out duration-200"
              onClick={() => handleDashBoardItemClick(actionTypes.showNotifications)}
            >
              <FaBell size={24} className="mr-2 bg-primary rounded-full p-1 w-fit text-white" />
              Notifications
            </button>
          </li>
          <li>
            <button
              className="flex gap-2 justify-center items-center my-3 font-menu text-gray-800 px-4 py-2 hover:bg-secondary rounded-md transition-all ease-in-out duration-200"
              onClick={() => handleDashBoardItemClick(actionTypes.showReviews)}
            >
              <MdReviews size={24} className="mr-2 bg-primary rounded-full p-1 w-fit text-white" />
              Reviews
            </button>
          </li>
          <li>
            <button
              className="flex gap-2 justify-center items-center my-3 font-menu text-gray-800 px-4 py-2 hover:bg-secondary rounded-md transition-all ease-in-out duration-200"
              onClick={() => handleDashBoardItemClick(actionTypes.showMessages)}
            >
              <MdMessage size={24} className="mr-2 bg-primary rounded-full p-1 w-fit text-white" />
              Messages
            </button>
          </li>
        </ul>
        <div>
          <button
            className="flex gap-2 justify-center items-center my-3 font-menu text-gray-800 px-4 py-2 hover:bg-secondary rounded-md transition-all ease-in-out duration-200"
            onClick={() => handleDashBoardItemClick(actionTypes.showSettings)}
          >
            <FaGear size={24} className="mr-2 bg-primary rounded-full p-1 w-fit text-white" />
            Settings
          </button>
          <button
            className="flex gap-2 justify-center items-center font-menu text-white bg-black py-1 rounded-md ml-6 my-6 px-4 hover:bg-other hover:text-red-600 transition-all ease-in-out duration-200"
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="pt-24 md:pt-28 px-4 md:px-8">
        {state.showSettings && (
          <div>
            {isEditing ? (
              <form onSubmit={handleFormSubmit} className="mb-4">
                <div className="mb-4 flex items-center">
                  <input
                    type="text"
                    name="first_name"
                    value={first_name}
                    placeholder={userName.split(' ')[0]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-400 p-2 rounded"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={last_name}
                    placeholder={userName.split(' ')[1]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-400 p-2 rounded"
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="text"
                    name="userName"
                    value={userName}
                    placeholder="Username"
                    onChange={handleInputChange}
                    className="w-full border border-gray-400 p-2 rounded"
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    placeholder="Email"
                    onChange={handleInputChange}
                    className="w-full border border-gray-400 p-2 rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-500 text-white p-2 rounded mt-2"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">Profile</h2>
                <p className="mb-2"><strong>Username:</strong> {userName}</p>
                <p className="mb-2"><strong>Email:</strong> {email}</p>
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}
        {state.showMyListings && <MyListings />}
        {state.showNotifications && <Notifications />}
        {state.showReviews && <Reviews />}
        {state.showMessages && <Messages />}
      </div>
    </section>
  );
}

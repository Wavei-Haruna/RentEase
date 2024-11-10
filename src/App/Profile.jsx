import { getAuth, updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect, useReducer } from 'react';
import { FaGear, FaUserGear } from 'react-icons/fa6';
import { FaBell, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import Spinner from './Spinner';
import { MdMenu, MdMessage, MdReviews } from 'react-icons/md';
import Notifications from './Hooks/Notifications';
import Reviews from './Reviews';
import Messages from './Messages';
import MyListings from './Hooks/MyListings';
import { AiFillHome } from 'react-icons/ai';
import { Link } from 'react-router-dom';

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
    <section className="relative w-full overflow-x-hidden bg-gray-200">
      {isUpdating && (
        <div className="absolute top-0 z-10 m-0 flex h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-70">
          <Spinner />
        </div>
      )}
      <header
        className={`fixed top-0 z-50 flex w-full items-center justify-between bg-primary px-8 py-2 ${sidebarOpen ? 'ml-72' : ''}`}
      >
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 transition-all duration-200 ease-in-out hover:bg-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MdMenu className="text-white" />
        </button>
        <Link to={'/'} className="flex items-center text-white transition-all duration-100 ease-out hover:scale-105">
          Home <AiFillHome className="mx-2" />
        </Link>
        <h1 className="font-header text-2xl font-bold text-white">Profile</h1>
      </header>
      <div
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col items-center justify-between bg-white shadow-md transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="w-full bg-[#f0f0f0] text-primary">
          <h3 className="text-gray-white my-3 flex items-center justify-center gap-2 px-4 py-2 font-menu transition-all duration-200 ease-in-out">
            <FaUserGear size={44} className="mr-2 w-fit rounded-full bg-primary p-1 text-white" />
            {userName}
          </h3>
          <h3 className="my-3 text-center font-header font-semibold md:text-xl">Welcome Dashboard</h3>
        </div>
        <ul className="list-none px-6">
          <li>
            <button
              className="my-3 flex items-center justify-center gap-2 rounded-md px-4 py-2 font-menu text-gray-800 transition-all duration-200 ease-in-out hover:bg-secondary"
              onClick={() => handleDashBoardItemClick(actionTypes.showMyListings)}
            >
              <FaList size={24} className="mr-2 w-fit rounded-full bg-primary p-1 text-white" />
              My Listings
            </button>
          </li>
          <li>
            <button
              className="my-3 flex items-center justify-center gap-2 rounded-md px-4 py-2 font-menu text-gray-800 transition-all duration-200 ease-in-out hover:bg-secondary"
              onClick={() => handleDashBoardItemClick(actionTypes.showNotifications)}
            >
              <FaBell size={24} className="mr-2 w-fit rounded-full bg-primary p-1 text-white" />
              Notifications
            </button>
          </li>
          <li>
            <button
              className="my-3 flex items-center justify-center gap-2 rounded-md px-4 py-2 font-menu text-gray-800 transition-all duration-200 ease-in-out hover:bg-secondary"
              onClick={() => handleDashBoardItemClick(actionTypes.showReviews)}
            >
              <MdReviews size={24} className="mr-2 w-fit rounded-full bg-primary p-1 text-white" />
              Reviews
            </button>
          </li>
          <li>
            <button
              className="my-3 flex items-center justify-center gap-2 rounded-md px-4 py-2 font-menu text-gray-800 transition-all duration-200 ease-in-out hover:bg-secondary"
              onClick={() => handleDashBoardItemClick(actionTypes.showMessages)}
            >
              <MdMessage size={24} className="mr-2 w-fit rounded-full bg-primary p-1 text-white" />
              Messages
            </button>
          </li>
        </ul>
        <div>
          <button
            className="my-3 flex items-center justify-center gap-2 rounded-md px-4 py-2 font-menu text-gray-800 transition-all duration-200 ease-in-out hover:bg-secondary"
            onClick={() => handleDashBoardItemClick(actionTypes.showSettings)}
          >
            <FaGear size={24} className="mr-2 w-fit rounded-full bg-primary p-1 text-white" />
            Settings
          </button>
          <button
            className="my-6 ml-6 flex items-center justify-center gap-2 rounded-md bg-black px-4 py-1 font-menu text-white transition-all duration-200 ease-in-out hover:bg-other hover:text-red-600"
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="px-4 pt-24 md:px-8 md:pt-28">
        {state.showSettings && (
          <div>
            {isEditing ? (
              <form onSubmit={handleFormSubmit} className="mb-4">
                <div className="mb-4 flex items-center gap-x-10">
                  <input
                    type="text"
                    name="first_name"
                    value={first_name}
                    placeholder={userName.split(' ')[0]}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-400 p-2 focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={last_name}
                    placeholder={userName.split(' ')[1]}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-400 p-2 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="text"
                    name="userName"
                    value={userName}
                    placeholder="Username"
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-400 p-2  focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    placeholder="Email"
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-400 p-2  focus:border-primary focus:outline-none"
                  />
                </div>
                <button type="submit" className="w-full rounded bg-blue-500 p-2 text-white">
                  Update Profile
                </button>
                <button
                  type="button"
                  className="mt-2 w-full rounded bg-gray-500 p-2 text-white"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <h2 className="mb-4 text-2xl font-bold">Profile</h2>
                <p className="mb-2">
                  <strong>Username:</strong> {userName}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {email}
                </p>
                <button className="rounded bg-blue-500 p-2 text-white" onClick={() => setIsEditing(true)}>
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

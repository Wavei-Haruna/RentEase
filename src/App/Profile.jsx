import { getAuth, updateProfile, onAuthStateChanged, signOut, updateEmail } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaEdit } from 'react-icons/fa'; // Importing icons from react-icons library
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth?.currentUser?.displayName || 'Name',
    email: auth?.currentUser?.email || 'Email',
  });

  const [isEditing, setIsEditing] = useState(false);

  const { name, email } = formData;

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
          name: user?.displayName || 'Name',
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

    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      await updateEmail(auth.currentUser, email);
      toast.success('Profile updated');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile: ', error);
      toast.error('error updating profile');
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
    <section className="h-screen w-screen bg-gray-100">
      <h1 className="relative top-6 mx-auto mb-4 w-fit rounded-lg border-l-4 border-r-4 border-secondary px-2 font-header text-3xl font-bold text-gray-400">
        My Profile
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg p-6 font-menu text-gray-500 shadow-md">
          <h3 className="mb-2 text-xl font-semibold">Settings</h3>
          {isEditing ? (
            <form onSubmit={handleFormSubmit} className="mb-4">
              <div className="mb-4 flex items-center">
                <FaUser className="mr-2 text-2xl text-blue-500" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                  className="border-b-2 border-blue-500 text-lg focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <FaEnvelope className="mr-2 text-2xl text-blue-500" />
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
                <FaUser className="mr-2 text-2xl text-blue-500" />
                <p className="text-lg">{name}</p>
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
      </div>
    </section>
  );
}

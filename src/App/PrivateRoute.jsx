import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthHook } from './Hooks/useAuthHook';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

export default function PrivateRoute() {
  const { isLoggedIn, checkingStatus } = useAuthHook();

  if (checkingStatus)
    return (
      <div className="absolute top-0 z-10 m-0 flex h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-70">
        <Spinner />{' '}
      </div>
    );
  return isLoggedIn ? (
    <Outlet />
  ) : (
    <div>
      <Navigate to={'/'} />
      {toast.warn('Please login')}
    </div>
  );
}

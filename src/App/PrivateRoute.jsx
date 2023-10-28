import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthHook } from './Hooks/useAuthHook';
import { toast } from 'react-toastify';

export default function PrivateRoute() {
  const { isLoggedIn, checkingStatus } = useAuthHook();

  if (checkingStatus) return <p>Loading...</p>;
  return isLoggedIn ? (
    <Outlet />
  ) : (
    <div>
      <Navigate to={'/'} />
      {toast.warn('Please login')}
    </div>
  );
}

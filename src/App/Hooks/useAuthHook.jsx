import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

export function useAuthHook() {
  const auth = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  }, [auth]);
  return { isLoggedIn, checkingStatus };
}

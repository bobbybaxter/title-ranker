import React, { useEffect, useState } from 'react';
import firebase from '../pages/api/firebase';

interface AuthContextProps {
  authenticated: boolean;
  handleLogout: () => void;
}

export const AuthContext = React.createContext<AuthContextProps>({
  authenticated: false,
  handleLogout: () => undefined,
});

export function AuthProvider({ children }: any) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser?.uid === process.env.NEXT_PUBLIC_ADMIN_UID) {
        setAuthenticated(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function handleLogout(): void {
    setAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

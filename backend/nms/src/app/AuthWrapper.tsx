'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import LoginForm from './LoginForm';

export default function AuthWrapper({ children }: { children: (user: any) => React.ReactNode }) {
  const [user, setUser] = useState(null as any);

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <LoginForm setUser={setUser} />;
  }

  return <>{children(user)}</>;
}

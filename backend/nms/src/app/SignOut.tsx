// SignOutButton.tsx
'use client';

import { signOut } from 'firebase/auth';
import { auth } from './firebase';

export default function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-black border border-black px-4 py-2 rounded-md ml-auto mr-8 transition transform duration-200 hover:bg-black hover:text-white hover:scale-105"
    >
      Sign Out
    </button>
  );
}

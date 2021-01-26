import React, { useState, useEffect, useContext, createContext } from 'react';
import Router from 'next/router';
import { createUser } from './store';
import supabase from './supabase';

const formatUser = (user) => ({
  uid: user.id,
  email: user.email,
});

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  const handleUser = (rawUser) => {
    if (rawUser) {
      const u = formatUser(rawUser);

      createUser(u);
      setStatus('idle');
      setUser(u);
      return u;
    }

    setStatus('error');
    setUser(null);
    return null;
  };

  const handleSession = (session) => {
    if (session?.user) {
      handleUser(session.user);
    }
  };

  const signInWithGitHub = async () => {
    setStatus('loading');

    supabase.auth.signIn({ provider: 'github' }).then((data) => {
      handleUser(data.user);
    });
  };

  const signOut = () => {
    const { error } = supabase.auth.signOut();

    if (error) {
      console.log('error signing out:', error);
    }

    handleUser(null);
    Router.push('/');
  };

  useEffect(() => {
    const session = supabase.auth.session();
    handleSession(session);

    const { data } = supabase.auth.onAuthStateChange((e, s) =>
      handleSession(s)
    );

    return () => data.unsubscribe();
  }, []);

  return { user, status, signInWithGitHub, signOut };
}

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);

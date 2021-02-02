import React, { useState, useEffect, useContext, createContext } from 'react';
import Router from 'next/router';
import { createUser } from './store';
import supabase from './supabase';
import { formatUser } from './User';

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const u = await formatUser(rawUser);

      createUser({ id: u.id, email: u.email });
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

  const refreshUser = () => {
    handleSession(supabase.auth.session());
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

  return { user, refreshUser, status, signInWithGitHub, signOut };
}

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);

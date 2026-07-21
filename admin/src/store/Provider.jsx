'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { hydrateFromStorage, fetchProfile } from './slices/authSlice';

function AuthHydrator({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('renewcred_admin_token');
    store.dispatch(hydrateFromStorage(token));
    if (token) store.dispatch(fetchProfile());
    setReady(true);
  }, []);

  // Avoid a flash of "logged out" UI before we've checked localStorage.
  if (!ready) return null;
  return children;
}

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
      <Toaster position="top-right" />
    </Provider>
  );
}

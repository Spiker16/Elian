'use client';

import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registrado:', reg.scope))
        .catch((err) => console.error('Error al registrar SW:', err));
    }
  }, []);

  return null;
}
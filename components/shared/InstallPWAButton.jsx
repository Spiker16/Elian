'use client';

import { useEffect, useState } from 'react';

export default function InstallPWAButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('desktop');
  const [secureContext, setSecureContext] = useState(true);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setPlatform(/iPad|iPhone|iPod/.test(userAgent) ? 'ios' : /Android/i.test(userAgent) ? 'android' : 'desktop');
    setSecureContext(window.isSecureContext);
    setInstalled(
      window.matchMedia('(display-mode: standalone)').matches
      || navigator.standalone === true
    );

    const handleInstallAvailable = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleCapturedInstallAvailable = () => {
      if (window.__stockProInstallPrompt) {
        setInstallPrompt(window.__stockProInstallPrompt);
      }
    };
    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setMessage('StockPro quedó instalada en este dispositivo.');
    };

    handleCapturedInstallAvailable();
    window.addEventListener('stockproinstallprompt', handleCapturedInstallAvailable);
    window.addEventListener('beforeinstallprompt', handleInstallAvailable);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('stockproinstallprompt', handleCapturedInstallAvailable);
      window.removeEventListener('beforeinstallprompt', handleInstallAvailable);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      setMessage(outcome === 'accepted' ? 'Instalación iniciada.' : 'La instalación fue cancelada.');
    } catch (error) {
      console.error('No se pudo iniciar la instalación de StockPro:', error);
      setMessage('El navegador no pudo iniciar la instalación. Usa las instrucciones de abajo.');
    } finally {
      window.__stockProInstallPrompt = null;
      setInstallPrompt(null);
    }
  };

  return (
    <details className="fixed right-4 top-4 z-[60] w-[min(22rem,calc(100vw-2rem))] text-sm">
      <summary className="ml-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-blue-400/40 bg-slate-900 px-4 py-2 font-semibold text-blue-200 shadow-lg hover:bg-slate-800">
        <span aria-hidden="true">↓</span>
        {installed ? 'App instalada' : 'Instalar app'}
      </summary>
      <div className="mt-2 space-y-3 rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-200 shadow-xl">
        <p className="font-semibold text-white">Instala StockPro en tu dispositivo</p>
        {installed ? (
          <p>La aplicación ya está instalada. Puedes abrirla desde tu pantalla de inicio o menú de aplicaciones.</p>
        ) : installPrompt ? (
          <button
            type="button"
            onClick={install}
            className="w-full rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-500"
          >
            Instalar StockPro
          </button>
        ) : platform === 'ios' ? (
          <p>En Safari, toca <strong>Compartir</strong> y luego <strong>Añadir a pantalla de inicio</strong>.</p>
        ) : platform === 'android' ? (
          <p>En Chrome, abre el menú <strong>⋮</strong> y elige <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong>.</p>
        ) : (
          <p>En Chrome o Edge, usa el icono de instalación de la barra de direcciones o el menú del navegador y selecciona <strong>Instalar StockPro</strong>.</p>
        )}
        {!installed && !secureContext && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">
            Para instalarla, publica la aplicación con HTTPS o ábrela en <strong>localhost</strong>. Una dirección HTTP de red local no es suficiente.
          </p>
        )}
        {message && <p role="status" className="text-blue-200">{message}</p>}
        {!installed && (
          <p className="text-xs text-slate-400">
            Si no aparece la opción, primero abre la app en línea y vuelve a intentarlo después de cargarla por completo.
          </p>
        )}
      </div>
    </details>
  );
}

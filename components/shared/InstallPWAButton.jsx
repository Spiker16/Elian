'use client';

import { useEffect, useState } from 'react';

export default function InstallPWAButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('desktop');
  const [secureContext, setSecureContext] = useState(true);
  const [embeddedBrowser, setEmbeddedBrowser] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setPlatform(/iPad|iPhone|iPod/.test(userAgent) ? 'ios' : /Android/i.test(userAgent) ? 'android' : 'desktop');
    setSecureContext(window.isSecureContext);
    setEmbeddedBrowser(/(?:\bCode\/|Visual Studio Code|Electron\/)/i.test(userAgent));
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

  const copyAppLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setMessage('Enlace copiado. Pégalo en Chrome o Edge para instalar la aplicación.');
    } catch (error) {
      console.error('No se pudo copiar el enlace de StockPro:', error);
      setMessage(`Abre esta dirección en Chrome o Edge: ${window.location.origin}`);
    }
  };

  return (
    <div className="fixed right-4 top-4 z-[60] w-[min(22rem,calc(100vw-2rem))] text-sm">
      {installPrompt ? (
        <button
          type="button"
          onClick={install}
          className="ml-auto flex w-fit items-center gap-2 rounded-full border border-blue-400/40 bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
        >
          <span aria-hidden="true">↓</span>
          Instalar StockPro
        </button>
      ) : (
        <details>
          <summary className="ml-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-blue-400/40 bg-slate-900 px-4 py-2 font-semibold text-blue-200 shadow-lg hover:bg-slate-800">
            <span aria-hidden="true">↓</span>
            {installed ? 'App instalada' : 'Cómo instalar'}
          </summary>
          <div className="mt-2 space-y-3 rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-200 shadow-xl">
            <p className="font-semibold text-white">Instala StockPro en tu dispositivo</p>
            {installed ? (
              <p>La aplicación ya está instalada. Puedes abrirla desde tu pantalla de inicio o menú de aplicaciones.</p>
            ) : embeddedBrowser ? (
              <>
                <p>
                  Estás viendo StockPro dentro de una ventana integrada de VS Code. Esa ventana no permite instalar aplicaciones web.
                  Ábrela en Chrome o Edge para instalarla.
                </p>
                <button
                  type="button"
                  onClick={copyAppLink}
                  className="w-full rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-500"
                >
                  Copiar enlace para Chrome o Edge
                </button>
              </>
            ) : platform === 'ios' ? (
              <p>En Safari, toca <strong>Compartir</strong> y luego <strong>Añadir a pantalla de inicio</strong>. iOS no muestra un botón de instalación dentro de la página.</p>
            ) : platform === 'android' ? (
              <p>En Chrome, abre el menú <strong>⋮</strong> y elige <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong>. La opción aparece en el menú del navegador.</p>
            ) : (
              <>
                <p>
                  Si Chrome o Edge no ofrece un instalador automático, abre su menú y selecciona <strong>Instalar página como aplicación</strong> (Chrome) o <strong>Aplicaciones → Instalar este sitio como una aplicación</strong> (Edge).
                </p>
                <button
                  type="button"
                  onClick={copyAppLink}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 font-semibold text-slate-100 hover:bg-slate-700"
                >
                  Copiar enlace de StockPro
                </button>
              </>
            )}
            {!installed && !secureContext && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">
                Para instalarla, publica la aplicación con HTTPS o ábrela en <strong>localhost</strong>. Una dirección HTTP de red local no es suficiente.
              </p>
            )}
            {message && <p role="status" className="text-blue-200">{message}</p>}
            {!installed && !embeddedBrowser && (
              <p className="text-xs text-slate-400">
                La instalación se inicia desde Chrome, Edge o Safari; la página no descarga un instalador de escritorio.
              </p>
            )}
          </div>
        </details>
      )}
      {message && installPrompt && <p role="status" className="mt-2 text-right text-xs text-blue-200">{message}</p>}
    </div>
  );
}

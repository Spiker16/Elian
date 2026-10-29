'use client';

import { useEffect, useState } from 'react';

export default function InstallPWAButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('desktop');
  const [secureContext, setSecureContext] = useState(true);
  const [embeddedBrowser, setEmbeddedBrowser] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isAppleMobile = /iPad|iPhone|iPod/.test(userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setPlatform(isAppleMobile ? 'ios' : /Android/i.test(userAgent) ? 'android' : 'desktop');
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
      setShowInstructions(false);
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
    if (!installPrompt) {
      setShowInstructions((visible) => !visible);
      return;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setMessage('Instalación iniciada.');
      } else {
        setMessage('La instalación fue cancelada.');
      }
    } catch (error) {
      console.error('No se pudo iniciar la instalación de StockPro:', error);
      setMessage('No se pudo abrir el instalador. Inténtalo desde el menú de instalación del navegador.');
      setShowInstructions(true);
    } finally {
      window.__stockProInstallPrompt = null;
      setInstallPrompt(null);
    }
  };

  return (
    <div className="fixed right-3 top-3 z-[60] w-[min(22rem,calc(100vw-1.5rem))] text-sm sm:right-4 sm:top-4 sm:w-[min(22rem,calc(100vw-2rem))]">
      <button
        type="button"
        onClick={install}
        disabled={installed}
        className="ml-auto flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-blue-300/50 bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-default disabled:border-emerald-400/30 disabled:bg-emerald-700 disabled:text-emerald-50"
      >
        <span aria-hidden="true">{installed ? '✓' : '↓'}</span>
        {installed ? 'App instalada' : 'Instalar StockPro'}
      </button>

      {showInstructions && !installed && (
        <div className="mt-2 max-h-[min(70vh,28rem)] space-y-3 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-200 shadow-xl">
          {embeddedBrowser ? (
            <>
              <p className="font-semibold text-white">Abre StockPro en un navegador</p>
              <p>
                Esta ventana integrada de VS Code no permite instalar aplicaciones. El botón instalará la app directamente cuando abras este sitio en Chrome o Edge.
              </p>
            </>
          ) : platform === 'ios' ? (
            <>
              <p className="font-semibold text-white">Añadir StockPro a inicio</p>
              <p>En Safari, toca <strong>Compartir</strong> y luego <strong>Añadir a pantalla de inicio</strong>. iOS no permite iniciar esta instalación desde un botón de la página.</p>
            </>
          ) : platform === 'android' ? (
            <>
              <p className="font-semibold text-white">Instalación no disponible desde este navegador</p>
              <p>Abre StockPro en Chrome. Si Chrome no ofrece el instalador automático, usa <strong>⋮ → Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong>.</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-white">Instalación no disponible desde este navegador</p>
              <p>El navegador no habilitó el instalador automático. En Chrome usa <strong>⋮ → Guardar y compartir → Instalar página como aplicación</strong>; en Edge usa <strong>⋯ → Aplicaciones → Instalar este sitio como una aplicación</strong>.</p>
            </>
          )}
          {!secureContext && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">
              La instalación requiere HTTPS o abrir el sitio en <strong>localhost</strong>.
            </p>
          )}
          {message && <p role="status" className="text-blue-200">{message}</p>}
          <button
            type="button"
            onClick={() => setShowInstructions(false)}
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      )}
      {message && !showInstructions && <p role="status" className="mt-2 text-right text-xs text-blue-200">{message}</p>}
    </div>
  );
}

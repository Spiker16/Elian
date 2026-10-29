import './global.css';
import { AppProvider } from '@/context/AppContext';
import Sidebar from '@/components/layout/Sidebar';
import RegisterSW from '@/components/shared/RegisterSW';
import InstallPWAButton from '@/components/shared/InstallPWAButton';
import Script from 'next/script';

export const metadata = {
  title: 'StockPro PWA',
  description: 'Sistema de Control de Inventario, Ventas y Predicciones',
  applicationName: 'StockPro',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'StockPro',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-192.png',
  },
};

export const viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen text-slate-100">
        <Script id="capture-pwa-install" strategy="beforeInteractive">
          {`window.addEventListener('beforeinstallprompt', function(event) {
            event.preventDefault();
            window.__stockProInstallPrompt = event;
            window.dispatchEvent(new Event('stockproinstallprompt'));
          });`}
        </Script>
        <AppProvider>
          <Sidebar />
          <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-28 pt-6 sm:px-6 md:px-8 md:py-8">
            {children}
          </main>
          <InstallPWAButton />
          <RegisterSW />
        </AppProvider>
      </body>
    </html>
  );
}
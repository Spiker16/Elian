'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function DatosLocalesPage() {
  const { products, sales, purchases, role, restoreLocalData } = useApp();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const exportBackup = () => {
    const backup = {
      app: 'StockPro',
      version: 1,
      exportedAt: new Date().toISOString(),
      products,
      sales,
      purchases,
      role,
    };
    const file = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stockpro-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setError('');
    setMessage('Respaldo descargado en este dispositivo.');
  };

  const importBackup = async (event) => {
    const [file] = event.target.files ?? [];
    if (!file) return;

    setError('');
    setMessage('');
    try {
      const backup = JSON.parse(await file.text());
      if (backup.app !== 'StockPro' || backup.version !== 1) {
        throw new Error('El archivo no es un respaldo compatible de StockPro.');
      }
      if (!window.confirm('Importar el respaldo reemplazará los productos, ventas y compras guardados en este dispositivo. ¿Deseas continuar?')) {
        return;
      }

      restoreLocalData(backup);
      setMessage('Respaldo restaurado en este dispositivo.');
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'No se pudo leer el archivo de respaldo.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Datos locales y respaldos</h1>
        <p className="text-sm text-slate-400">
          StockPro guarda la información en el almacenamiento de este navegador. No usa una base de datos ni envía tus registros a un servidor.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ['Productos', products.length],
          ['Ventas', sales.length],
          ['Compras', purchases.length],
        ].map(([label, count]) => (
          <div key={label} className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-sm text-slate-400">{label} en este dispositivo</p>
            <p className="mt-1 text-2xl font-bold text-blue-300">{count}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-5">
        <h2 className="font-semibold text-white">Copia de seguridad</h2>
        <p className="text-sm text-slate-300">
          Descarga un archivo JSON para guardar o trasladar tus datos. La copia solo se crea cuando pulsas el botón.
        </p>
        <button
          type="button"
          onClick={exportBackup}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 sm:w-auto"
        >
          Descargar respaldo local
        </button>
        <div className="border-t border-slate-700 pt-4">
          <label htmlFor="backup-file" className="mb-2 block font-semibold text-white">Restaurar un respaldo</label>
          <p className="mb-3 text-sm text-slate-300">
            Restaurar reemplaza los registros actuales de este navegador. Exporta una copia antes si quieres conservarlos.
          </p>
          <input
            id="backup-file"
            type="file"
            accept="application/json,.json"
            onChange={importBackup}
            className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-2 file:text-white"
          />
        </div>
        {message && <p role="status" className="text-sm text-emerald-300">{message}</p>}
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      </section>
    </div>
  );
}

'use client';

import { useApp } from '@/context/AppContext';

export default function AlertasPage() {
  const { products } = useApp();
  const today = new Date();

  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const expiringSoon = products.filter((p) => {
    if (!p.fechaVencimiento) return false;
    const expDate = new Date(p.fechaVencimiento);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 15;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">3. Alertas Inteligentes</h2>

      <div className="space-y-4">
        <h3 className="font-bold text-amber-400">Stock Crítico o Mínimo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lowStock.map((p) => (
            <div key={p.id} className="bg-slate-800 border-l-4 border-amber-500 p-4 rounded-r-xl">
              <p className="font-bold">{p.nombre}</p>
              <p className="text-xs text-slate-400">Stock Actual: <span className="text-amber-400 font-bold">{p.stock}</span> / Mínimo: {p.minStock}</p>
            </div>
          ))}
        </div>

        <h3 className="font-bold text-red-400 pt-4">Próximos a Vencer (15 días)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {expiringSoon.map((p) => (
            <div key={p.id} className="bg-slate-800 border-l-4 border-red-500 p-4 rounded-r-xl">
              <p className="font-bold">{p.nombre}</p>
              <p className="text-xs text-slate-400">Vence: <span className="text-red-400 font-bold">{p.fechaVencimiento}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
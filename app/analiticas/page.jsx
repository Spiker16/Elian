'use client';

import { useApp } from '@/context/AppContext';
import RoleGuard from '@/components/shared/RoleGuard';

export default function AnaliticasPage() {
  const { sales, products } = useApp();

  return (
    <RoleGuard permission="canViewAnalytics">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">4. Análisis de Ventas</h2>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
          <h3 className="font-bold text-slate-200">Historial Reciente de Ventas</h3>
          <div className="space-y-2">
            {sales.length === 0 && (
              <p className="rounded-lg bg-slate-900 p-4 text-sm text-slate-400">
                Aún no hay ventas registradas. El análisis se actualizará con las ventas reales que registres.
              </p>
            )}
            {sales.map((sale) => (
              <div key={sale.id} className="bg-slate-900 p-3 rounded flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-blue-400">{sale.id}</p>
                  <p className="text-xs text-slate-400">{new Date(sale.fecha).toLocaleString()}</p>
                </div>
                <p className="font-bold text-emerald-400">${sale.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
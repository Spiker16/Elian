'use client';

import { useApp } from '@/context/AppContext';
import { calculateStockForecasting } from '@/lib/forecasting';
import RoleGuard from '@/components/shared/RoleGuard';

export default function PrediccionPage() {
  const { products, sales } = useApp();

  return (
    <RoleGuard permission="canViewPredictions">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">5. Predicción de Existencias (Smart Reorder)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => {
            const forecast = calculateStockForecasting(p, sales);
            return (
              <div key={p.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
                <h3 className="font-bold text-white">{p.nombre}</h3>
                <div className="text-xs space-y-1 text-slate-300">
                  <p>Consumo Diario Promedio: <strong>{forecast.dailyVelocity} unidades/día</strong></p>
                  <p>Días Estimados hasta Agotarse: <strong className="text-amber-400">{forecast.daysUntilOut}</strong></p>
                  <p>Sugerencia Recompra: <strong className="text-emerald-400">{forecast.suggestedReorder} unidades</strong></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RoleGuard>
  );
}
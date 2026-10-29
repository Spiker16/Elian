'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ROLES } from '@/lib/rbac';

export default function Sidebar() {
  const pathname = usePathname();
  const { role, setRole } = useApp();

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/inventario', label: 'Inventario' },
    { href: '/pos', label: 'Ventas y Compras' },
    { href: '/alertas', label: 'Alertas' },
    { href: '/analiticas', label: 'Análisis' },
    { href: '/prediccion', label: 'Predicción' },
    { href: '/empleados', label: 'Empleados' },
    { href: '/datos', label: 'Respaldos' },
  ];

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 flex justify-between border-t border-slate-800 bg-slate-950/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-r md:border-t-0 md:p-5">
      <div className="min-w-0 md:w-full">
        <div className="mb-8 hidden items-center gap-3 md:flex">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 text-sm font-black text-white shadow-lg shadow-blue-950/40">
            SP
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">StockPro</h1>
            <p className="text-xs text-slate-500">Control de inventario</p>
          </div>
        </div>

        <nav aria-label="Navegación principal" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:text-sm md:w-full ${
                  active ? 'bg-blue-500/15 text-blue-200 md:border md:border-blue-400/15' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden w-full border-t border-slate-800 pt-5 md:block">
        <div>
          <label htmlFor="active-role" className="mb-2 block text-xs font-medium text-slate-400">Rol de usuario</label>
          <select
            id="active-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200"
          >
            <option value={ROLES.ADMIN}>Propietario</option>
            <option value={ROLES.EMPLOYEE}>Empleado</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
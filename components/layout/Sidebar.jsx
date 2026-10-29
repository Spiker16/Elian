'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ROLES } from '@/lib/rbac';

export default function Sidebar() {
  const pathname = usePathname();
  const { role, setRole } = useApp();
  const [moreOpen, setMoreOpen] = useState(false);

  const links = [
    { href: '/', label: 'Inicio', mobileLabel: 'Inicio' },
    { href: '/inventario', label: 'Inventario', mobileLabel: 'Stock' },
    { href: '/pos', label: 'Ventas y Compras', mobileLabel: 'Ventas' },
    { href: '/alertas', label: 'Alertas', mobileLabel: 'Alertas' },
    { href: '/analiticas', label: 'Análisis' },
    { href: '/prediccion', label: 'Predicción' },
    { href: '/empleados', label: 'Empleados' },
    { href: '/datos', label: 'Respaldos' },
  ];
  const primaryLinks = links.slice(0, 4);
  const secondaryLinks = links.slice(4);

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-slate-800 bg-slate-950/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:items-stretch md:flex-col md:border-r md:border-t-0 md:p-5">
      <div className="min-w-0 flex-1 md:w-full md:flex-none">
        <div className="mb-8 hidden items-center gap-3 md:flex">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 text-sm font-black text-white shadow-lg shadow-blue-950/40">
            SP
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">StockPro</h1>
            <p className="text-xs text-slate-500">Control de inventario</p>
          </div>
        </div>

        <nav aria-label="Navegación principal" className="grid w-full grid-cols-5 gap-1 md:flex md:flex-col md:overflow-visible">
          {primaryLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`min-w-0 rounded-xl px-1 py-2.5 text-center text-[11px] font-semibold leading-tight transition sm:text-xs md:w-full md:px-3 md:text-left md:text-sm ${
                  active ? 'bg-blue-500/15 text-blue-200 md:border md:border-blue-400/15' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="md:hidden">{link.mobileLabel}</span>
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
          <div className="relative min-w-0 md:hidden">
            <button
              type="button"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((open) => !open)}
              className={`w-full rounded-xl px-1 py-2.5 text-center text-[11px] font-semibold leading-tight ${
                moreOpen || secondaryLinks.some((link) => pathname === link.href)
                  ? 'bg-blue-500/15 text-blue-200'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Más
            </button>
            {moreOpen && (
              <nav
                aria-label="Más opciones"
                className="absolute bottom-full right-0 mb-3 flex min-w-44 flex-col gap-1 rounded-2xl border border-slate-700 bg-slate-950 p-2 shadow-2xl"
              >
                {secondaryLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setMoreOpen(false)}
                      className={`rounded-xl px-3 py-2.5 text-left text-sm font-medium ${
                        active ? 'bg-blue-500/15 text-blue-200' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
          <div className="hidden md:block">
            {secondaryLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`mb-1 block w-full rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    active ? 'bg-blue-500/15 text-blue-200 md:border md:border-blue-400/15' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
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
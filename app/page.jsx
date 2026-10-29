'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';

const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' });

export default function HomePage() {
  const { products, sales } = useApp();

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStock = products.filter((product) => product.stock <= product.minStock);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const shortcuts = [
    { href: '/pos', eyebrow: 'Punto de venta', label: 'Registrar venta', icon: '＋', tone: 'blue' },
    { href: '/inventario', eyebrow: `${products.length} productos`, label: 'Abrir inventario', icon: '▦', tone: 'violet' },
    { href: '/alertas', eyebrow: `${lowStock.length} requieren atención`, label: 'Ver alertas', icon: '!', tone: 'amber' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Tu negocio, en orden</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Panel principal</h1>
          <p className="mt-2 text-sm text-slate-400">Resumen de tu inventario y actividad local.</p>
        </div>
        <Link
          href="/datos"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
        >
          <span aria-hidden="true">↗</span> Datos y respaldos
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Resumen del negocio">
        <article className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/15 to-slate-900/80 p-5 shadow-lg shadow-blue-950/10">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl" />
          <p className="relative text-sm font-medium text-slate-300">Unidades en inventario</p>
          <p className="relative mt-3 text-4xl font-bold tracking-tight text-white">{totalStock.toLocaleString('es-MX')}</p>
          <p className="relative mt-2 text-xs text-blue-200/80">Distribuidas en {products.length} productos</p>
        </article>
        <article className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-slate-900/80 p-5">
          <p className="text-sm font-medium text-slate-300">Stock bajo</p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-white">{lowStock.length}</p>
          <p className="mt-2 text-xs text-amber-200/80">Productos en o por debajo del mínimo</p>
        </article>
        <article className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-slate-900/80 p-5 sm:col-span-2 xl:col-span-1">
          <p className="text-sm font-medium text-slate-300">Ventas acumuladas</p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-white">{currency.format(totalRevenue)}</p>
          <p className="mt-2 text-xs text-emerald-200/80">{sales.length} operaciones registradas en este dispositivo</p>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">Accesos rápidos</h2>
          <p className="mt-1 text-sm text-slate-400">Las tareas más comunes, a un clic.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {shortcuts.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-800/90"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xl font-bold ${
                item.tone === 'blue' ? 'bg-blue-500/15 text-blue-300' :
                  item.tone === 'amber' ? 'bg-amber-500/15 text-amber-300' : 'bg-violet-500/15 text-violet-300'
              }`} aria-hidden="true">{item.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-slate-400">{item.eyebrow}</span>
                <span className="mt-1 block font-semibold text-white">{item.label}</span>
              </span>
              <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/65">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="font-bold text-white">Productos que requieren atención</h2>
            <p className="mt-1 text-xs text-slate-400">Existencias en o por debajo de su nivel mínimo</p>
          </div>
          <Link href="/inventario" className="shrink-0 text-sm font-semibold text-blue-300 hover:text-blue-200">
            Inventario <span aria-hidden="true">→</span>
          </Link>
        </div>
        {lowStock.length === 0 ? (
          <p className="px-5 py-8 text-sm text-slate-400">Todo bien: no hay productos con stock bajo.</p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {lowStock.slice(0, 5).map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">{product.nombre}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{product.sku} · Mínimo {product.minStock}</p>
                </div>
                <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">
                  {product.stock} unidades
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

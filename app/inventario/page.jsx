'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { hasPermission } from '@/lib/rbac';
import RoleGuard from '@/components/shared/RoleGuard';

export default function InventarioPage() {
  const { role, products, addProduct, deleteProduct } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');
  const [form, setForm] = useState({ sku: '', nombre: '', categoria: '', stock: 0, minStock: 5, precioCompra: 0, precioVenta: 0, fechaVencimiento: '' });
  const categories = [...new Set(products.map((product) => product.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const filteredProducts = products.filter((product) => {
    const matchesQuery = `${product.nombre} ${product.sku}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (category === 'Todas' || product.categoria === category);
  });
  const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-blue-400';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.sku) return;
    addProduct({
      ...form,
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      precioCompra: Number(form.precioCompra),
      precioVenta: Number(form.precioVenta),
    });
    setQuery('');
    setCategory('Todas');
    setForm({ sku: '', nombre: '', categoria: '', stock: 0, minStock: 5, precioCompra: 0, precioVenta: 0, fechaVencimiento: '' });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Catálogo y existencias</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Inventario</h1>
          <p className="mt-2 text-sm text-slate-400">{products.length} productos guardados en este dispositivo</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
          <span className="font-bold text-white">{products.reduce((sum, product) => sum + product.stock, 0).toLocaleString('es-MX')}</span> unidades en total
        </div>
      </header>

      <RoleGuard permission="canManageProducts">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/65 p-5 sm:p-6">
          <div>
            <h2 className="font-bold text-white">Agregar producto</h2>
            <p className="mt-1 text-xs text-slate-400">Completa los datos para guardarlo en el dispositivo.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <input aria-label="SKU o código" placeholder="SKU / Código *" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={inputClass} required />
            <input aria-label="Nombre del producto" placeholder="Nombre del producto *" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputClass} required />
            <input aria-label="Categoría" placeholder="Categoría" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className={inputClass} />
            <input aria-label="Fecha de vencimiento" type="date" value={form.fechaVencimiento} onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })} className={inputClass} />
            <input aria-label="Stock inicial" type="number" min="0" placeholder="Stock inicial" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} />
            <input aria-label="Stock mínimo" type="number" min="0" placeholder="Stock mínimo" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} className={inputClass} />
            <input aria-label="Precio de compra" type="number" min="0" step="0.01" placeholder="Precio compra" value={form.precioCompra} onChange={(e) => setForm({ ...form, precioCompra: e.target.value })} className={inputClass} />
            <input aria-label="Precio de venta" type="number" min="0" step="0.01" placeholder="Precio venta" value={form.precioVenta} onChange={(e) => setForm({ ...form, precioVenta: e.target.value })} className={inputClass} />
          </div>
          <button type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 sm:w-auto">
            + Guardar producto
          </button>
        </form>
      </RoleGuard>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/65">
        <div className="flex flex-col gap-3 border-b border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-white">Todos los productos</h2>
            <p className="mt-1 text-xs text-slate-400">Mostrando {filteredProducts.length} de {products.length}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(12rem,1fr)_auto]">
            <input
              type="search"
              aria-label="Buscar producto"
              placeholder="Buscar por nombre o SKU..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={inputClass}
            />
            <select aria-label="Filtrar por categoría" value={category} onChange={(event) => setCategory(event.target.value)} className={inputClass}>
              <option value="Todas">Todas las categorías</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold text-slate-200">No encontramos productos</p>
            <p className="mt-1 text-sm text-slate-500">Prueba con otro nombre, SKU o categoría.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Producto</th>
                  <th className="px-4 py-3 font-semibold">Categoría</th>
                  <th className="px-4 py-3 font-semibold">Existencias</th>
                  <th className="px-4 py-3 font-semibold">Precio venta</th>
                  <th className="px-4 py-3 font-semibold">Vencimiento</th>
                  {hasPermission(role, 'canDeleteRecords') && <th className="px-5 py-3 font-semibold">Acción</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredProducts.map((product) => {
                  const low = product.stock <= product.minStock;
                  return (
                    <tr key={product.id} className="transition hover:bg-slate-800/40">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-white">{product.nombre}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">{product.sku}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs">{product.categoria || 'Sin categoría'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${low ? 'border border-amber-400/20 bg-amber-400/10 text-amber-200' : 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-200'}`}>
                          {product.stock} <span className="font-normal opacity-75">/ mín. {product.minStock}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-100">${product.precioVenta.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-400">{product.fechaVencimiento || 'No aplica'}</td>
                      {hasPermission(role, 'canDeleteRecords') && (
                        <td className="px-5 py-3.5">
                          <button type="button" onClick={() => deleteProduct(product.id)} className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-400/10 hover:text-rose-200">Eliminar</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
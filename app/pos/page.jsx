'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function POSPage() {
  const { products, registerSale, registerPurchase } = useApp();
  const [selectedProd, setSelectedProd] = useState('');
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);

  const addToCart = () => {
    const prod = products.find((p) => p.id === selectedProd);
    if (!prod || qty <= 0) return;
    setCart((prev) => [...prev, { productId: prod.id, nombre: prod.nombre, cantidad: Number(qty), precioVenta: prod.precioVenta }]);
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    registerSale(cart);
    setCart([]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">2. Registro de Ventas y Compras</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registrar Venta */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
          <h3 className="font-bold text-emerald-400">Registrar Venta</h3>
          <div className="flex gap-2">
            <select value={selectedProd} onChange={(e) => setSelectedProd(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-sm">
              <option value="">Seleccionar Producto...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} (Disponibles: {p.stock})</option>
              ))}
            </select>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="w-20 bg-slate-900 border border-slate-700 p-2 rounded text-sm" min="1" />
            <button onClick={addToCart} className="bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded text-sm font-bold">Agregar</button>
          </div>

          <div className="border-t border-slate-700 pt-3 space-y-2">
            <h4 className="text-xs text-slate-400">Carrito de Venta</h4>
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm bg-slate-900 p-2 rounded">
                <span>{item.nombre} x {item.cantidad}</span>
                <span>${(item.precioVenta * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
            <button onClick={handleCompleteSale} disabled={cart.length === 0} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-2 rounded font-bold text-sm">
              Finalizar Venta (${cart.reduce((a, b) => a + b.precioVenta * b.cantidad, 0).toFixed(2)})
            </button>
          </div>
        </div>

        {/* Entrada de Mercancía / Compra */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
          <h3 className="font-bold text-blue-400">Entrada de Mercancía (Reabastecer)</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const id = e.target.product.value;
            const cantidad = Number(e.target.cantidad.value);
            const costo = Number(e.target.costo.value);
            if (id && cantidad > 0) {
              registerPurchase(id, cantidad, costo);
              e.target.reset();
            }
          }} className="space-y-3">
            <select name="product" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-sm" required>
              <option value="">Seleccionar Producto...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <input name="cantidad" type="number" placeholder="Cantidad Recibida" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-sm" required min="1" />
            <input name="costo" type="number" step="0.01" placeholder="Nuevo Precio Compra (opcional)" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-sm" />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold text-sm">
              Registrar Entrada
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
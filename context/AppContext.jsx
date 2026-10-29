'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES } from '@/lib/rbac';

const AppContext = createContext();
const INITIAL_DATA_VERSION = '3';
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNonNegativeNumber = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;

function isValidProduct(product) {
  return isRecord(product)
    && typeof product.id === 'string'
    && typeof product.sku === 'string'
    && typeof product.nombre === 'string'
    && isNonNegativeNumber(product.stock)
    && isNonNegativeNumber(product.minStock)
    && isNonNegativeNumber(product.precioCompra)
    && isNonNegativeNumber(product.precioVenta);
}

function isValidSale(sale) {
  return isRecord(sale)
    && typeof sale.id === 'string'
    && typeof sale.fecha === 'string'
    && isNonNegativeNumber(sale.total)
    && Array.isArray(sale.items)
    && sale.items.every((item) => isRecord(item)
      && typeof item.productId === 'string'
      && isNonNegativeNumber(item.cantidad)
      && isNonNegativeNumber(item.precioVenta));
}

function isValidPurchase(purchase) {
  return isRecord(purchase)
    && typeof purchase.id === 'string'
    && typeof purchase.fecha === 'string'
    && typeof purchase.productId === 'string'
    && isNonNegativeNumber(purchase.cantidad)
    && isNonNegativeNumber(purchase.costoTotal);
}

const initialProducts = [
  { id: '1', sku: 'PROD-001', nombre: 'Leche Entera 1L', categoria: 'Lácteos', stock: 5, minStock: 10, precioCompra: 0.8, precioVenta: 1.2, fechaVencimiento: '2026-11-05' },
  { id: '2', sku: 'PROD-002', nombre: 'Arroz Integral 1kg', categoria: 'Abarrotes', stock: 45, minStock: 15, precioCompra: 1.1, precioVenta: 1.8, fechaVencimiento: '2027-01-20' },
  { id: '3', sku: 'PROD-003', nombre: 'Café Grano 500g', categoria: 'Bebidas', stock: 8, minStock: 12, precioCompra: 4.5, precioVenta: 7.0, fechaVencimiento: '2026-11-02' },
  { id: '4', sku: 'PROD-004', nombre: 'Yogur Natural 500g', categoria: 'Lácteos', stock: 18, minStock: 8, precioCompra: 1.15, precioVenta: 1.75, fechaVencimiento: '2026-11-18' },
  { id: '5', sku: 'PROD-005', nombre: 'Queso Manchego 250g', categoria: 'Lácteos', stock: 9, minStock: 6, precioCompra: 2.8, precioVenta: 4.2, fechaVencimiento: '2026-12-10' },
  { id: '6', sku: 'PROD-006', nombre: 'Pasta Espagueti 500g', categoria: 'Abarrotes', stock: 32, minStock: 12, precioCompra: 0.75, precioVenta: 1.25, fechaVencimiento: '2027-06-30' },
  { id: '7', sku: 'PROD-007', nombre: 'Aceite de Oliva 500ml', categoria: 'Abarrotes', stock: 14, minStock: 8, precioCompra: 5.2, precioVenta: 7.9, fechaVencimiento: '2027-04-15' },
  { id: '8', sku: 'PROD-008', nombre: 'Jugo de Naranja 1L', categoria: 'Bebidas', stock: 7, minStock: 10, precioCompra: 1.3, precioVenta: 2.1, fechaVencimiento: '2026-11-12' },
  { id: '9', sku: 'PROD-009', nombre: 'Agua Mineral 1.5L', categoria: 'Bebidas', stock: 48, minStock: 18, precioCompra: 0.4, precioVenta: 0.8, fechaVencimiento: '2027-08-01' },
  { id: '10', sku: 'PROD-010', nombre: 'Galletas de Avena 300g', categoria: 'Snacks', stock: 6, minStock: 10, precioCompra: 1.05, precioVenta: 1.7, fechaVencimiento: '2026-12-22' },
  { id: '11', sku: 'PROD-011', nombre: 'Chocolate Amargo 100g', categoria: 'Snacks', stock: 21, minStock: 9, precioCompra: 1.4, precioVenta: 2.3, fechaVencimiento: '2027-02-14' },
  { id: '12', sku: 'PROD-012', nombre: 'Detergente Líquido 1L', categoria: 'Limpieza', stock: 16, minStock: 7, precioCompra: 3.1, precioVenta: 4.8, fechaVencimiento: '' },
  { id: '13', sku: 'PROD-013', nombre: 'Frijol Negro 1kg', categoria: 'Abarrotes', stock: 27, minStock: 12, precioCompra: 1.35, precioVenta: 2.1, fechaVencimiento: '2027-08-15' },
  { id: '14', sku: 'PROD-014', nombre: 'Harina de Trigo 1kg', categoria: 'Abarrotes', stock: 19, minStock: 10, precioCompra: 0.85, precioVenta: 1.4, fechaVencimiento: '2027-03-20' },
  { id: '15', sku: 'PROD-015', nombre: 'Atún en Agua 140g', categoria: 'Enlatados', stock: 34, minStock: 15, precioCompra: 0.95, precioVenta: 1.55, fechaVencimiento: '2028-01-10' },
  { id: '16', sku: 'PROD-016', nombre: 'Maíz Dulce 300g', categoria: 'Enlatados', stock: 22, minStock: 10, precioCompra: 0.7, precioVenta: 1.2, fechaVencimiento: '2027-11-25' },
  { id: '17', sku: 'PROD-017', nombre: 'Té Verde 20 sobres', categoria: 'Bebidas', stock: 13, minStock: 6, precioCompra: 1.6, precioVenta: 2.6, fechaVencimiento: '2027-09-30' },
  { id: '18', sku: 'PROD-018', nombre: 'Cereal de Maíz 400g', categoria: 'Desayuno', stock: 11, minStock: 8, precioCompra: 2.1, precioVenta: 3.3, fechaVencimiento: '2027-01-18' },
  { id: '19', sku: 'PROD-019', nombre: 'Miel de Abeja 350g', categoria: 'Desayuno', stock: 8, minStock: 5, precioCompra: 3.4, precioVenta: 5.2, fechaVencimiento: '2027-12-01' },
  { id: '20', sku: 'PROD-020', nombre: 'Jabón de Manos 250ml', categoria: 'Limpieza', stock: 17, minStock: 8, precioCompra: 1.25, precioVenta: 2.0, fechaVencimiento: '' },
  { id: '21', sku: 'PROD-021', nombre: 'Papel Higiénico 4 rollos', categoria: 'Hogar', stock: 24, minStock: 10, precioCompra: 2.3, precioVenta: 3.6, fechaVencimiento: '' },
  { id: '22', sku: 'PROD-022', nombre: 'Papas Fritas 150g', categoria: 'Snacks', stock: 5, minStock: 12, precioCompra: 0.8, precioVenta: 1.35, fechaVencimiento: '2026-12-12' },
  { id: '23', sku: 'PROD-023', nombre: 'Manzana Roja por kg', categoria: 'Frutas y Verduras', stock: 15, minStock: 8, precioCompra: 1.5, precioVenta: 2.5, fechaVencimiento: '2026-11-04' },
  { id: '24', sku: 'PROD-024', nombre: 'Plátano por kg', categoria: 'Frutas y Verduras', stock: 4, minStock: 7, precioCompra: 0.9, precioVenta: 1.6, fechaVencimiento: '2026-11-02' },
];

export function AppProvider({ children }) {
  const [role, setRole] = useState(ROLES.ADMIN);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const localProd = localStorage.getItem('stockpro_products');
    const localSales = localStorage.getItem('stockpro_sales');
    const localPurchases = localStorage.getItem('stockpro_purchases');
    const savedRole = localStorage.getItem('stockpro_role');
    const savedProducts = localProd ? JSON.parse(localProd) : null;
    let productsToLoad = Array.isArray(savedProducts) ? savedProducts : initialProducts;

    if (Array.isArray(savedProducts) && localStorage.getItem('stockpro_seed_version') !== INITIAL_DATA_VERSION) {
      const savedSkus = new Set(savedProducts.map((product) => product.sku));
      productsToLoad = [
        ...initialProducts.filter((product) => !savedSkus.has(product.sku)),
        ...savedProducts,
      ];
    }

    setProducts(productsToLoad);
    setSales(localSales ? JSON.parse(localSales) : []);
    setPurchases(localPurchases ? JSON.parse(localPurchases) : []);
    setRole(Object.values(ROLES).includes(savedRole) ? savedRole : ROLES.ADMIN);
    localStorage.setItem('stockpro_seed_version', INITIAL_DATA_VERSION);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('stockpro_products', JSON.stringify(products));
      localStorage.setItem('stockpro_sales', JSON.stringify(sales));
      localStorage.setItem('stockpro_purchases', JSON.stringify(purchases));
      localStorage.setItem('stockpro_role', role);
    }
  }, [products, sales, purchases, role, loaded]);

  const addProduct = (prod) => {
    setProducts((prev) => [...prev, { ...prod, id: Date.now().toString() }]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const registerSale = (items) => {
    let totalSale = 0;
    const updatedProducts = [...products];

    items.forEach((item) => {
      const prodIndex = updatedProducts.findIndex((p) => p.id === item.productId);
      if (prodIndex !== -1) {
        updatedProducts[prodIndex].stock = Math.max(0, updatedProducts[prodIndex].stock - item.cantidad);
        totalSale += item.precioVenta * item.cantidad;
      }
    });

    const newSale = {
      id: 'SALE-' + Date.now(),
      fecha: new Date().toISOString(),
      items,
      total: totalSale,
    };

    setProducts(updatedProducts);
    setSales((prev) => [newSale, ...prev]);
  };

  const registerPurchase = (productId, cantidad, precioCompra) => {
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: p.stock + cantidad, precioCompra: precioCompra || p.precioCompra };
      }
      return p;
    });

    const newPurchase = {
      id: 'BUY-' + Date.now(),
      fecha: new Date().toISOString(),
      productId,
      cantidad,
      costoTotal: cantidad * precioCompra,
    };

    setProducts(updatedProducts);
    setPurchases((prev) => [newPurchase, ...prev]);
  };

  const restoreLocalData = (data) => {
    if (!data
      || !Array.isArray(data.products) || !data.products.every(isValidProduct)
      || !Array.isArray(data.sales) || !data.sales.every(isValidSale)
      || !Array.isArray(data.purchases) || !data.purchases.every(isValidPurchase)) {
      throw new Error('El respaldo contiene productos, ventas o compras con datos inválidos.');
    }

    setProducts(data.products);
    setSales(data.sales);
    setPurchases(data.purchases);
    setRole(Object.values(ROLES).includes(data.role) ? data.role : ROLES.ADMIN);
  };

  return (
    <AppContext.Provider value={{
      role, setRole, products, addProduct, updateProduct, deleteProduct,
      sales, registerSale, purchases, registerPurchase, restoreLocalData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
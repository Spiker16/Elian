export function calculateStockForecasting(product, salesList, daysHistory = 30) {
  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - daysHistory);

  // Filtrar ventas del producto en la ventana de tiempo especificada
  const totalUnitsSold = salesList.reduce((acc, sale) => {
    const saleDate = new Date(sale.fecha);
    if (saleDate >= pastDate) {
      const item = sale.items.find((i) => i.productId === product.id);
      if (item) acc += item.cantidad;
    }
    return acc;
  }, 0);

  const dailyVelocity = totalUnitsSold / daysHistory;
  const daysUntilOut = dailyVelocity > 0 ? Math.floor(product.stock / dailyVelocity) : Infinity;

  // Sugerencia de compra para cubrir 30 días adicionales
  const targetStock = Math.ceil(dailyVelocity * 30);
  const suggestedReorder = Math.max(0, targetStock + product.minStock - product.stock);

  return {
    dailyVelocity: Number(dailyVelocity.toFixed(2)),
    daysUntilOut: isFinite(daysUntilOut) ? daysUntilOut : 'Sin consumo reciente',
    suggestedReorder,
    urgency: daysUntilOut <= 7 ? 'CRITICA' : daysUntilOut <= 15 ? 'MEDIA' : 'BAJA',
  };
}
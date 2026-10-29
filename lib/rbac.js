export const ROLES = {
  ADMIN: 'Propietario',
  EMPLOYEE: 'Empleado',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Propietario',
  [ROLES.EMPLOYEE]: 'Empleado',
};

export const PERMISSION_LABELS = {
  canManageProducts: 'Administrar productos e inventario',
  canRegisterSales: 'Registrar ventas',
  canRegisterPurchases: 'Registrar compras y reabastecimientos',
  canViewAnalytics: 'Consultar análisis de ventas',
  canViewPredictions: 'Consultar predicciones de existencias',
  canManageEmployees: 'Administrar empleados y roles',
  canDeleteRecords: 'Eliminar productos y registros',
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    canManageProducts: true,
    canRegisterSales: true,
    canRegisterPurchases: true,
    canViewAnalytics: true,
    canViewPredictions: true,
    canManageEmployees: true,
    canDeleteRecords: true,
  },
  [ROLES.EMPLOYEE]: {
    canManageProducts: false,
    canRegisterSales: true,
    canRegisterPurchases: true,
    canViewAnalytics: false,
    canViewPredictions: false,
    canManageEmployees: false,
    canDeleteRecords: false,
  },
};

export function hasPermission(role, permissionKey) {
  return PERMISSIONS[role]?.[permissionKey] ?? false;
}
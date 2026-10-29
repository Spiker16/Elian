'use client';

import { useApp } from '@/context/AppContext';
import { hasPermission, ROLE_LABELS } from '@/lib/rbac';

export default function RoleGuard({ permission, children }) {
  const { role } = useApp();

  if (!hasPermission(role, permission)) {
    return (
      <div className="p-6 bg-slate-800 border border-red-500/30 rounded-xl text-center">
        <h3 className="text-lg font-bold text-red-400 mb-1">Acceso Restringido</h3>
        <p className="text-sm text-slate-400">
          Tu rol actual (<strong>{ROLE_LABELS[role] ?? 'Sin rol asignado'}</strong>) no tiene autorización para acceder a esta área.
        </p>
      </div>
    );
  }

  return children;
}
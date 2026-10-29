'use client';

import { useApp } from '@/context/AppContext';
import { ROLES, PERMISSIONS, ROLE_LABELS, PERMISSION_LABELS } from '@/lib/rbac';
import RoleGuard from '@/components/shared/RoleGuard';

export default function EmpleadosPage() {
  const { role, setRole } = useApp();

  return (
    <RoleGuard permission="canManageEmployees">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">6. Gestión de Empleados y Permisos</h2>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
          <h3 className="font-bold">Simulación de Permisos por Rol</h3>
          <div className="flex gap-4">
            <button onClick={() => setRole(ROLES.ADMIN)} className={`px-4 py-2 rounded font-bold text-sm ${role === ROLES.ADMIN ? 'bg-blue-600' : 'bg-slate-700'}`}>
              Rol Propietario
            </button>
            <button onClick={() => setRole(ROLES.EMPLOYEE)} className={`px-4 py-2 rounded font-bold text-sm ${role === ROLES.EMPLOYEE ? 'bg-blue-600' : 'bg-slate-700'}`}>
              Rol Empleado
            </button>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <h4 className="font-bold text-sm mb-2">Permisos del Rol Seleccionado:</h4>
            <ul className="text-xs space-y-1 text-slate-300">
              {Object.entries(PERMISSIONS[role]).map(([permission, active]) => (
                <li key={permission} className={active ? 'text-emerald-400' : 'text-slate-500'}>
                  <span aria-hidden="true">{active ? '✓' : '✗'}</span>{' '}
                  {PERMISSION_LABELS[permission]}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Rol activo: {ROLE_LABELS[role] ?? 'Sin rol asignado'}
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
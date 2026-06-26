import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminDevicesProvider, useAdminDevices } from '../../context/AdminDevicesContext';
import AdminDashboard from '../../components/admin/AdminDashboard';
import DevicesManager from '../../components/admin/DevicesManager';
import PricesManager from '../../components/admin/PricesManager';

const NAV = [
  {
    id: 'dashboard',
    label: 'Inicio',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'devices',
    label: 'Taller',
    badgeKey: 'activeCount',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'prices',
    label: 'Precios',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const AdminShell = () => {
  const { logout, user } = useAuth();
  const { stats } = useAdminDevices();
  const [tab, setTab] = useState('dashboard');
  const [devicesAction, setDevicesAction] = useState(null);

  const handleNavigate = ({ tab: nextTab, action }) => {
    setTab(nextTab);
    if (action) setDevicesAction(action);
  };

  return (
    <div className="min-h-screen bg-void flex flex-col lg:flex-row">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 xl:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-void-900/95 border-r border-electric-500/15">
        <div className="p-5 border-b border-electric-500/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-400">Panel admin</p>
          <h1 className="text-base font-black text-white mt-0.5">Software Móvil Pro</h1>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const badge = item.badgeKey ? stats[item.badgeKey] : 0;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-electric-500/15 text-electric-200 border border-electric-400/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-void-800 border border-transparent'
                }`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {badge > 0 && item.badgeKey && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyber-400/20 text-cyber-300">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-electric-500/10 space-y-2">
          <p className="text-[10px] text-slate-600 truncate px-1">{user?.email}</p>
          <Link
            to="/"
            className="block w-full text-center px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-electric-300 border border-electric-500/15"
          >
            Ver sitio
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-red-400 border border-red-500/25 hover:bg-red-500/10"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile header + bottom nav */}
      <header className="lg:hidden sticky top-0 z-40 bg-void-900/95 backdrop-blur-xl border-b border-electric-500/20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-electric-400">Admin</p>
            <h1 className="text-sm font-black text-white">Software Móvil Pro</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-slate-400 px-2 py-1">Sitio</Link>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-red-400 px-2 py-1 border border-red-500/30 rounded-lg"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 lg:ml-60 xl:ml-64 pb-20 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          <div className={tab === 'dashboard' ? '' : 'hidden'}>
            <AdminDashboard onNavigate={handleNavigate} />
          </div>
          <div className={tab === 'devices' ? '' : 'hidden'}>
            <DevicesManager
              pendingAction={devicesAction}
              onActionHandled={() => setDevicesAction(null)}
            />
          </div>
          <div className={tab === 'prices' ? '' : 'hidden'}>
            <PricesManager />
          </div>
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-void-900/95 backdrop-blur-xl border-t border-electric-500/20 px-2 py-2">
        <div className="flex justify-around max-w-lg mx-auto">
          {NAV.map((item) => {
            const badge = item.badgeKey ? stats[item.badgeKey] : 0;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
                  active ? 'text-electric-300' : 'text-slate-500'
                }`}
              >
                {item.icon}
                {item.label}
                {badge > 0 && item.badgeKey && (
                  <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-cyber-400 text-void text-[9px] font-black flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

const AdminPanel = () => (
  <AdminDevicesProvider>
    <AdminShell />
  </AdminDevicesProvider>
);

export default AdminPanel;

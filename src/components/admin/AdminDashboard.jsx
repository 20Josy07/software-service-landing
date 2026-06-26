import React from 'react';
import { DEVICE_STATUSES } from '../../firebase/devicesService';
import { formatCOP } from '../../utils/formatPrice';
import { formatDateTime } from '../../utils/formatDate';
import { useAdminDevices } from '../../context/AdminDevicesContext';

const StatCard = ({ label, value, sub, accent = 'electric', onClick }) => {
  const accents = {
    electric: 'border-electric-400/25 bg-electric-500/5',
    cyber: 'border-cyber-400/25 bg-cyber-400/5',
    amber: 'border-amber-400/25 bg-amber-500/5',
    blue: 'border-blue-400/25 bg-blue-500/5',
  };

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`text-left p-4 sm:p-5 rounded-2xl border transition-all ${accents[accent]} ${
        onClick ? 'hover:border-electric-400/40 hover:bg-void-800/80 cursor-pointer' : ''
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-2xl sm:text-3xl font-black text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </Wrapper>
  );
};

const AdminDashboard = ({ onNavigate }) => {
  const { loading, loadError, stats } = useAdminDevices();

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-9 h-9 border-2 border-electric-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
        {loadError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Resumen del taller</h2>
          <p className="text-sm text-slate-400 mt-1">
            Vista general de ingresos, cola y pendientes · {stats.monthLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate({ tab: 'devices', action: { openForm: true } })}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-brand text-void shadow-glow-green"
        >
          + Registrar equipo
        </button>
      </div>

      {/* Alertas */}
      {(stats.readyNotNotifiedCount > 0 || stats.readyCount > 0) && (
        <div className="space-y-2">
          {stats.readyNotNotifiedCount > 0 && (
            <button
              type="button"
              onClick={() => onNavigate({ tab: 'devices', action: { statusFilter: 'listo' } })}
              className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-left hover:bg-amber-500/15 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-amber-300">
                  {stats.readyNotNotifiedCount} equipo{stats.readyNotNotifiedCount === 1 ? '' : 's'} listo
                  {stats.readyNotNotifiedCount === 1 ? '' : 's'} sin avisar
                </p>
                <p className="text-xs text-amber-200/70 mt-0.5">
                  Envía el mensaje de WhatsApp al cliente para que pase a recoger
                </p>
              </div>
              <span className="text-amber-400 text-xl">→</span>
            </button>
          )}
          {stats.pendingCollection > 0 && (
            <div className="p-4 rounded-2xl bg-cyber-400/5 border border-cyber-400/20">
              <p className="text-sm font-semibold text-cyber-300">
                Saldo por cobrar al entregar: {formatCOP(stats.pendingCollection)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                En {stats.readyCount} equipo{stats.readyCount === 1 ? '' : 's'} marcado
                {stats.readyCount === 1 ? '' : 's'} como listo
              </p>
            </div>
          )}
        </div>
      )}

      {/* Ingresos */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ingresos hoy"
          value={formatCOP(stats.todayRevenue)}
          sub={`${stats.todayDeliveredCount} entrega${stats.todayDeliveredCount === 1 ? '' : 's'}`}
          accent="cyber"
        />
        <StatCard
          label="Ingresos del mes"
          value={formatCOP(stats.monthRevenue)}
          sub={`${stats.monthDeliveredCount} entrega${stats.monthDeliveredCount === 1 ? '' : 's'}`}
          accent="electric"
        />
        <StatCard
          label="Por cobrar (listos)"
          value={formatCOP(stats.pendingCollection)}
          sub="Saldo 50% al entregar"
          accent="amber"
          onClick={
            stats.readyCount > 0
              ? () => onNavigate({ tab: 'devices', action: { statusFilter: 'listo' } })
              : undefined
          }
        />
        <StatCard
          label="En taller"
          value={formatCOP(stats.workshopValue)}
          sub={`${stats.activeCount} equipo${stats.activeCount === 1 ? '' : 's'} activo${stats.activeCount === 1 ? '' : 's'}`}
          accent="blue"
          onClick={
            stats.activeCount > 0
              ? () => onNavigate({ tab: 'devices', action: { viewFilter: 'activos' } })
              : undefined
          }
        />
      </div>

      {/* Estados */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 mb-3">Estado del taller</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {DEVICE_STATUSES.map((status) => {
            const count = stats.byStatus[status.id]?.length ?? 0;
            return (
              <button
                key={status.id}
                type="button"
                onClick={() =>
                  onNavigate({
                    tab: 'devices',
                    action:
                      status.id === 'entregado'
                        ? { viewFilter: 'entregados' }
                        : { viewFilter: 'activos', statusFilter: status.id },
                  })
                }
                className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] ${status.color}`}
              >
                <p className="text-3xl font-black">{count}</p>
                <p className="text-xs font-semibold mt-1">{status.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cola */}
        <section className="p-5 rounded-2xl bg-void-800/60 border border-electric-500/15">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Cola de trabajo</h3>
            <button
              type="button"
              onClick={() => onNavigate({ tab: 'devices', action: { viewFilter: 'activos' } })}
              className="text-xs text-electric-400 hover:text-electric-300 font-semibold"
            >
              Ver todo →
            </button>
          </div>
          {stats.queuePreview.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No hay equipos en cola</p>
          ) : (
            <ul className="space-y-2">
              {stats.queuePreview.map((device, index) => (
                <li
                  key={device.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-void-900/80 border border-electric-500/10"
                >
                  <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-void-800 text-xs font-black text-electric-400">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {device.brand} {device.model}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {device.customerName} · {device.serviceLabel}
                    </p>
                  </div>
                  {device.quotedPrice && (
                    <span className="text-xs font-bold text-cyber-400 shrink-0">
                      {formatCOP(device.quotedPrice)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Últimas entregas */}
        <section className="p-5 rounded-2xl bg-void-800/60 border border-electric-500/15">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Últimas entregas</h3>
            <button
              type="button"
              onClick={() => onNavigate({ tab: 'devices', action: { viewFilter: 'entregados' } })}
              className="text-xs text-electric-400 hover:text-electric-300 font-semibold"
            >
              Ver historial →
            </button>
          </div>
          {stats.recentDeliveries.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">Aún no hay entregas registradas</p>
          ) : (
            <ul className="space-y-2">
              {stats.recentDeliveries.map((device) => (
                <li
                  key={device.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-void-900/80 border border-electric-500/10"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {device.brand} {device.model}
                    </p>
                    <p className="text-xs text-slate-500">
                      {device.customerName}
                      {device.deliveredAt && ` · ${formatDateTime(device.deliveredAt)}`}
                    </p>
                  </div>
                  {device.quotedPrice && (
                    <span className="text-xs font-bold text-electric-300 shrink-0">
                      {formatCOP(device.quotedPrice)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Abonos pendientes */}
      {stats.depositsExpected > 0 && (
        <div className="p-4 rounded-2xl bg-void-800/40 border border-electric-500/10 text-sm">
          <span className="text-slate-400">Abonos iniciales esperados (50%): </span>
          <span className="font-bold text-electric-300">{formatCOP(stats.depositsExpected)}</span>
          <span className="text-slate-500 text-xs ml-2">
            en equipos recibidos o en proceso
          </span>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

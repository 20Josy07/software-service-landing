import React, { useEffect, useMemo, useState } from 'react';
import { adminServiceOptions, isOtherService } from '../../data/adminServices';
import { services as catalog } from '../../data/services';
import {
  createDevice,
  deleteDevice,
  DEVICE_STATUSES,
  getStatusMeta,
  updateDevice,
} from '../../firebase/devicesService';
import { serverTimestamp } from 'firebase/firestore';
import { useServicePrices } from '../../hooks/useServicePrices';
import { applyParsedToForm, parseClientMessage } from '../../utils/parseClientMessage';
import { buildDeviceReadyMessage } from '../../utils/buildDeviceReadyMessage';
import { getCustomerWhatsAppUrl, normalizeCustomerPhone } from '../../constants/contact';
import { formatCOP } from '../../utils/formatPrice';
import {
  applyServicePrice,
  getPriceForService,
  parseChargedPrice,
} from '../../utils/paymentUtils';
import PaymentSummary from './PaymentSummary';
import ServiceEstimate from './ServiceEstimate';
import { WhatsAppIcon } from '../WhatsAppButton';
import { formatDateTime } from '../../utils/formatDate';
import { useAdminDevices } from '../../context/AdminDevicesContext';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';

const emptyForm = {
  customerName: '',
  customerPhone: '',
  brand: '',
  model: '',
  service: catalog[0]?.id ?? '',
  customServiceLabel: '',
  notes: '',
  imei: '',
  listPrice: 0,
  quotedPrice: '',
};

const EXAMPLE_MESSAGE = `Hola, quiero solicitar un servicio de software móvil.

Marca: Samsung
Modelo: Galaxy S21 5G
Servicio: Respaldo y Migración

Quedo atento a su respuesta. Gracias.`;

const DevicesManager = ({ pendingAction, onActionHandled }) => {
  const { devices, loading, stats } = useAdminDevices();
  const { prices } = useServicePrices();
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [parseResult, setParseResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('activos');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const showSuccess = (message) => {
    setSuccessMsg(message);
    window.setTimeout(() => setSuccessMsg(null), 3500);
  };

  useEffect(() => {
    if (!pendingAction) return;
    if (pendingAction.viewFilter) setFilter(pendingAction.viewFilter);
    if (pendingAction.statusFilter) setStatusFilter(pendingAction.statusFilter);
    if (pendingAction.openForm) openNewForm();
    onActionHandled?.();
  }, [pendingAction]);

  useEffect(() => {
    if (!prices) return;
    setForm((prev) => {
      if (!prev.service) return prev;
      const listPrice = getPriceForService(prices, prev.service);
      const quotedUnchanged =
        !prev.quotedPrice || parseChargedPrice(prev.quotedPrice) === prev.listPrice;
      if (prev.listPrice === listPrice && prev.quotedPrice) return prev;
      return {
        ...prev,
        listPrice,
        quotedPrice: quotedUnchanged && listPrice > 0 ? String(listPrice) : prev.quotedPrice,
      };
    });
  }, [prices]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return devices.filter((d) => {
      if (filter === 'activos' && d.status === 'entregado') return false;
      if (filter === 'entregados' && d.status !== 'entregado') return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [
        d.customerName,
        d.customerPhone,
        d.brand,
        d.model,
        d.serviceLabel,
        d.notes,
        d.imei,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [devices, filter, statusFilter, search]);

  const activeQueue = useMemo(
    () => devices.filter((d) => d.status !== 'entregado'),
    [devices],
  );

  const queuePosition = useMemo(
    () => new Map(activeQueue.map((d, i) => [d.id, i + 1])),
    [activeQueue],
  );

  const runParse = (text) => {
    const parsed = parseClientMessage(text);
    setParseResult(parsed);
    if (parsed.detected.length > 0) {
      setForm((prev) => applyParsedToForm(parsed, prev, adminServiceOptions, prices));
    }
    return parsed;
  };

  const handlePaste = (e) => {
    const text = e.clipboardData?.getData('text') ?? '';
    if (!text.trim()) return;
    setTimeout(() => {
      setPasteText(text);
      runParse(text);
      setShowForm(true);
    }, 0);
  };

  const handleParseClick = () => {
    runParse(pasteText);
    setShowForm(true);
  };

  const openNewForm = () => {
    const serviceId = catalog[0]?.id ?? '';
    const listPrice = getPriceForService(prices, serviceId);
    setShowForm(true);
    setForm({
      ...emptyForm,
      service: serviceId,
      listPrice,
      quotedPrice: listPrice > 0 ? String(listPrice) : '',
    });
    setPasteText('');
    setParseResult(null);
  };

  const handleServiceChange = (serviceId) => {
    setForm((prev) => applyServicePrice(prev, serviceId, prices));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setSaving(true);
    try {
      const serviceMeta = adminServiceOptions.find((s) => s.id === form.service);
      const charged = parseChargedPrice(form.quotedPrice);
      const listPrice = isOtherService(form.service)
        ? charged
        : form.listPrice || getPriceForService(prices, form.service);
      const serviceLabel = isOtherService(form.service)
        ? form.customServiceLabel.trim()
        : serviceMeta?.title ?? form.service;
      await createDevice({
        ...form,
        serviceLabel,
        listPrice: isOtherService(form.service) ? null : listPrice || null,
        quotedPrice: charged,
      });
      setForm(emptyForm);
      setPasteText('');
      setParseResult(null);
      setShowForm(false);
      showSuccess('Equipo registrado correctamente.');
    } catch {
      setError('No se pudo registrar el equipo. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    setError(null);
    try {
      const updates = { status };
      if (status !== 'listo') updates.readyNotifiedAt = null;
      if (status === 'entregado') updates.deliveredAt = serverTimestamp();
      await updateDevice(id, updates);
      if (status === 'entregado') showSuccess('Equipo marcado como entregado.');
    } catch {
      setError('No se pudo actualizar el estado.');
    } finally {
      setBusyId(null);
    }
  };

  const handleStatusSelect = (device, newStatus) => {
    if (newStatus === 'entregado') {
      setConfirm({
        type: 'deliver',
        id: device.id,
        title: 'Confirmar entrega',
        message: `¿Entregar ${device.brand} ${device.model} a ${device.customerName}?${
          device.quotedPrice ? ` Ingreso: ${formatCOP(device.quotedPrice)}.` : ''
        }`,
      });
      return;
    }
    handleStatusChange(device.id, newStatus);
  };

  const handleConfirmAction = async () => {
    if (!confirm) return;
    if (confirm.type === 'deliver') {
      await handleStatusChange(confirm.id, 'entregado');
    } else if (confirm.type === 'delete') {
      await handleDeleteConfirmed(confirm.id);
    }
    setConfirm(null);
  };

  const handleNotifyReady = async (device) => {
    setBusyId(device.id);
    setError(null);
    try {
      const url = getCustomerWhatsAppUrl(
        device.customerPhone,
        buildDeviceReadyMessage(device),
      );
      if (!url) return;
      window.open(url, '_blank', 'noopener,noreferrer');
      await updateDevice(device.id, { readyNotifiedAt: serverTimestamp() });
    } catch {
      setError('No se pudo registrar el aviso.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = (device) => {
    setConfirm({
      type: 'delete',
      id: device.id,
      title: 'Eliminar registro',
      message: `¿Eliminar ${device.brand} ${device.model} de ${device.customerName}? No se puede deshacer.`,
    });
  };

  const handleDeleteConfirmed = async (id) => {
    setBusyId(id);
    setError(null);
    try {
      await deleteDevice(id);
      showSuccess('Registro eliminado.');
    } catch {
      setError('No se pudo eliminar el registro.');
    } finally {
      setBusyId(null);
    }
  };

  const canSubmit =
    form.brand &&
    form.model &&
    form.customerName &&
    form.customerPhone &&
    parseChargedPrice(form.quotedPrice) &&
    (!isOtherService(form.service) || form.customServiceLabel.trim().length >= 3);

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="px-4 py-3 rounded-xl bg-cyber-400/10 border border-cyber-400/30 text-sm text-cyber-300 font-medium">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs text-red-400 hover:text-red-200 shrink-0"
          >
            Cerrar
          </button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Taller</h2>
          <p className="text-sm text-slate-400 mt-1">
            {stats.activeCount} en cola · {formatCOP(stats.workshopValue)} en proceso
          </p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-brand text-void shadow-glow-green"
        >
          + Registrar equipo
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setPasteText('');
          setParseResult(null);
        }}
        size="full"
        accent="cyber"
        eyebrow="Nuevo ingreso"
        title="Registrar equipo"
        description="Pega el mensaje de WhatsApp del cliente o completa los datos manualmente."
        footer={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-400 bg-white/5 border border-white/10 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !canSubmit}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-bold bg-gradient-brand text-void disabled:opacity-50 shadow-glow-green"
            >
              {saving ? 'Guardando...' : 'Registrar ingreso'}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-electric-500/5 border border-electric-400/20 space-y-4">
            <div>
              <label htmlFor="paste-message" className="block text-sm font-bold text-electric-300 mb-1">
                Pegar mensaje de WhatsApp
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Detectamos automáticamente marca, modelo y servicio del mensaje del cliente.
              </p>
              <textarea
                id="paste-message"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                onPaste={handlePaste}
                rows={5}
                placeholder={EXAMPLE_MESSAGE}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono leading-relaxed placeholder:text-slate-600 focus:outline-none focus:border-electric-400/50 resize-y"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleParseClick}
                disabled={!pasteText.trim()}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-brand text-void disabled:opacity-40"
              >
                Autocompletar
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasteText(EXAMPLE_MESSAGE);
                  runParse(EXAMPLE_MESSAGE);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 border border-white/10 hover:text-slate-200"
              >
                Ver ejemplo
              </button>
            </div>
            {parseResult && (
              <div className="flex flex-wrap gap-2">
                {parseResult.detected.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyber-400/15 text-cyber-400 border border-cyber-400/30"
                  >
                    ✓ {item}
                  </span>
                ))}
                {parseResult.missing.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25"
                  >
                    Falta {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <p className="sm:col-span-2 text-xs text-slate-500 border-b border-white/5 pb-3">
              Completa nombre y teléfono si no vinieron en el mensaje de WhatsApp.
            </p>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Cliente *</label>
              <input
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-electric-400/50 focus:outline-none"
                placeholder="Nombre del contacto"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Teléfono / WhatsApp *</label>
              <input
                required
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-electric-400/50 focus:outline-none"
                placeholder="3150489702"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Marca *</label>
              <input
                required
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-electric-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Modelo *</label>
              <input
                required
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-electric-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Servicio *</label>
              <select
                value={form.service}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
              >
                {adminServiceOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                    {s.id !== 'otro' && prices?.[s.id] != null ? ` — ${formatCOP(prices[s.id])}` : ''}
                  </option>
                ))}
              </select>
            </div>
            {isOtherService(form.service) && (
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Describe el servicio *</label>
                <input
                  required
                  value={form.customServiceLabel}
                  onChange={(e) => setForm({ ...form, customServiceLabel: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-electric-400/50 focus:outline-none"
                  placeholder="Ej: Liberación de red..."
                />
              </div>
            )}
            <ServiceEstimate serviceId={form.service} queueDevices={activeQueue} />
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tarifa lista</label>
              <input
                readOnly
                value={
                  isOtherService(form.service)
                    ? 'Sin tarifa — precio manual'
                    : form.listPrice
                      ? formatCOP(form.listPrice)
                      : '—'
                }
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 text-sm cursor-default"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Precio a cobrar *</label>
              <input
                required
                value={form.quotedPrice}
                onChange={(e) => setForm({ ...form, quotedPrice: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-electric-400/50 focus:outline-none"
                placeholder="60000"
              />
            </div>
            <PaymentSummary listPrice={form.listPrice} chargedPrice={form.quotedPrice} />
            <div>
              <label className="block text-xs text-slate-400 mb-1">IMEI (opcional)</label>
              <input
                value={form.imei}
                onChange={(e) => setForm({ ...form, imei: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Notas</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none"
                placeholder="Observaciones..."
              />
            </div>
            {!canSubmit && parseResult?.detected.length > 0 && (
              <p className="sm:col-span-2 text-xs text-amber-400">
                {isOtherService(form.service) && !form.customServiceLabel.trim()
                  ? 'Describe el servicio y el precio a cobrar.'
                  : 'Completa los campos obligatorios (*) para guardar.'}
              </p>
            )}
          </form>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirmAction}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.type === 'delete' ? 'Eliminar' : 'Confirmar entrega'}
        variant={confirm?.type === 'delete' ? 'danger' : 'default'}
        loading={Boolean(confirm && busyId === confirm.id)}
      />

      {/* Filtros y búsqueda */}
      <div className="space-y-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente, modelo, teléfono..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-void-900 border border-electric-500/20 text-white text-sm placeholder-slate-600 focus:border-electric-400/50 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'activos', label: 'Activos', count: stats.activeCount },
            { id: 'entregados', label: 'Entregados', count: stats.deliveredCount },
            { id: 'todos', label: 'Todos', count: devices.length },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilter(f.id);
                if (f.id === 'entregados') setStatusFilter('entregado');
                else if (f.id === 'activos' && statusFilter === 'entregado') setStatusFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                filter === f.id
                  ? 'bg-electric-500/20 border-electric-400/50 text-electric-200'
                  : 'bg-void-800 border-electric-500/15 text-slate-400'
              }`}
            >
              {f.label}
              <span className="ml-1 opacity-70">({f.count})</span>
            </button>
          ))}
        </div>

        {filter !== 'entregados' && (
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Todos' },
              ...DEVICE_STATUSES.filter((s) => s.id !== 'entregado').map((s) => ({
                id: s.id,
                label: s.label,
                count: stats.byStatus[s.id]?.length ?? 0,
              })),
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatusFilter(s.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                  statusFilter === s.id
                    ? 'bg-cyber-400/15 border-cyber-400/40 text-cyber-300'
                    : 'bg-void-800/50 border-electric-500/10 text-slate-500 hover:text-slate-300'
                }`}
              >
                {s.label}
                {s.count != null && s.count > 0 && (
                  <span className="ml-1 text-cyber-400">{s.count}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lista FIFO */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-electric-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-12 text-sm">No hay equipos en esta vista.</p>
        ) : (
          filtered.map((device) => {
            const statusMeta = getStatusMeta(device.status);
            const canNotifyReady =
              device.status === 'listo' && Boolean(normalizeCustomerPhone(device.customerPhone));
            const fifoNumber = queuePosition.get(device.id);
            const isBusy = busyId === device.id;
            return (
              <article
                key={device.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
                  device.status === 'listo'
                    ? 'bg-cyber-400/5 border-cyber-400/30 hover:border-cyber-400/50'
                    : 'bg-void-800/80 border-electric-500/15 hover:border-electric-500/30'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex items-center gap-3 lg:w-16 flex-shrink-0">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-void-900 border border-electric-500/20 text-xs font-black text-electric-400"
                      title={fifoNumber ? `Posicion ${fifoNumber} en cola` : undefined}
                    >
                      {fifoNumber ?? '—'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">Equipo</p>
                      <p className="font-bold text-white">
                        {device.brand} {device.model}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{device.serviceLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Cliente</p>
                      <p className="font-semibold text-slate-200">{device.customerName}</p>
                      <a
                        href={getCustomerWhatsAppUrl(device.customerPhone) ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyber-400 hover:underline"
                      >
                        {device.customerPhone}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Ingreso</p>
                      <p className="text-sm text-slate-300">{formatDateTime(device.intakeAt)}</p>
                      <PaymentSummary
                        compact
                        listPrice={device.listPrice ?? device.quotedPrice}
                        chargedPrice={device.quotedPrice}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-44 flex-shrink-0">
                    <select
                      value={device.status}
                      disabled={isBusy}
                      onChange={(e) => handleStatusSelect(device, e.target.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border bg-void-900 disabled:opacity-50 ${statusMeta.color}`}
                    >
                      {DEVICE_STATUSES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {canNotifyReady && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleNotifyReady(device)}
                          className="inline-flex flex-1 items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors disabled:opacity-50"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                          Avisar listo
                        </button>
                        {device.readyNotifiedAt && (
                          <span
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyber-400/15 border border-cyber-400/30 text-cyber-400 flex-shrink-0"
                            title={`Avisado el ${formatDateTime(device.readyNotifiedAt)}`}
                            aria-label={`Cliente avisado el ${formatDateTime(device.readyNotifiedAt)}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDelete(device)}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {device.notes && (
                  <p className="mt-3 pt-3 border-t border-electric-500/10 text-xs text-slate-400">
                    <span className="text-slate-500">Notas:</span> {device.notes}
                    {device.imei && <span className="ml-3 text-slate-500">IMEI: {device.imei}</span>}
                  </p>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DevicesManager;

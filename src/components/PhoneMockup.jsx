import React from 'react';

const PhoneMockup = () => (
  <div className="relative mx-auto w-[260px] sm:w-[280px]" aria-hidden="true">
    {/* Glow detrás del teléfono */}
    <div className="absolute inset-0 bg-gradient-to-b from-electric-500/30 to-cyber-400/15 blur-3xl scale-110" />

    {/* Marco del dispositivo */}
    <div className="relative rounded-[2.5rem] border-2 border-electric-400/40 bg-void-800 p-2 shadow-2xl shadow-electric-500/20 glow-blue">
      {/* Notch */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-950 rounded-full z-10" />

      {/* Pantalla */}
      <div className="relative rounded-[2rem] bg-void overflow-hidden aspect-[9/19]">
        {/* Barra de estado */}
        <div className="flex items-center justify-between px-5 pt-8 pb-3 text-[10px] text-slate-500 font-medium">
          <span>9:41</span>
          <div className="flex gap-1">
            <span className="w-3 h-1.5 border border-slate-600 rounded-sm" />
            <span className="w-1 h-1.5 bg-slate-600 rounded-sm" />
          </div>
        </div>

        {/* Contenido simulado — terminal técnico */}
        <div className="px-4 pb-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse" />
            <span className="text-[11px] font-mono text-cyber-400">Sistema en recuperación</span>
          </div>

          <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3 space-y-2 font-mono text-[10px] leading-relaxed">
            <p className="text-slate-500">
              <span className="text-electric-400">$</span> adb devices
            </p>
            <p className="text-neon-400/90">SM-A546B &nbsp; device</p>
            <p className="text-slate-500 mt-2">
              <span className="text-electric-400">$</span> fastboot flash...
            </p>
            <p className="text-slate-400">Sending &apos;boot&apos; (65536 KB)... OKAY</p>
            <p className="text-slate-400">Finished. Total time: 12.4s</p>
            <p className="text-neon-400 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Bootloop resuelto
            </p>
          </div>

          {/* Progress bar animada */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>Verificación IMEI</span>
              <span className="text-neon-400">Listo</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-electric-500 to-neon-500 rounded-full animate-shimmer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {['FRP', 'Flash', 'Root', 'Backup'].map((tag) => (
              <div
                key={tag}
                className="text-center py-1.5 rounded-md bg-slate-800/60 border border-slate-700/50 text-[9px] font-semibold text-slate-400 uppercase tracking-wider"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PhoneMockup;

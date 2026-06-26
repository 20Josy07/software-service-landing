import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) navigate('/admin/panel', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/panel');
    } catch {
      setError('Credenciales incorrectas. Verifica email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div className="relative w-full max-w-md p-8 rounded-2xl bg-void-900 border border-electric-500/25 shadow-glow-cyan">
        <p className="text-xs font-bold uppercase tracking-widest text-electric-400 mb-2">
          Panel administrativo
        </p>
        <h1 className="text-2xl font-black text-white mb-1">Software Móvil Pro</h1>
        <p className="text-sm text-slate-400 mb-8">Inicia sesión para gestionar precios y equipos.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 mb-1.5">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-void-800 border border-electric-500/25 text-white focus:outline-none focus:border-electric-400/60"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-void-800 border border-electric-500/25 text-white focus:outline-none focus:border-electric-400/60"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold bg-gradient-brand text-void disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <a href="/" className="block mt-6 text-center text-xs text-slate-500 hover:text-slate-300">
          ← Volver a la página principal
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;

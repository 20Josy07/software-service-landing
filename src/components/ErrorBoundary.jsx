import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-void flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-lg font-bold text-white mb-2">Algo salio mal</p>
            <p className="text-sm text-slate-400 mb-6">
              Recarga la pagina. Si el problema continua, verifica tu conexion.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-brand text-void"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

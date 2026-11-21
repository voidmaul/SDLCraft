import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an unexpected error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-neo text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 border-2 border-rose-900 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Terjadi Kesalahan Aplikasi</h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Maaf, aplikasi mengalami kendala teknis saat memuat tampilan. Silakan coba muat ulang halaman.
            </p>
            {this.state.error && (
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 mb-6 text-left overflow-x-auto font-mono text-xs text-rose-700">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-brand-yellow text-brand-dark font-black text-sm rounded-xl border-2 border-brand-dark shadow-neo hover:shadow-neo-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

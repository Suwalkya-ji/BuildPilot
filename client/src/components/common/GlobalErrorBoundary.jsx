import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[GlobalErrorBoundary] App Exception Caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0d13] p-6 text-slate-100 select-none">
          <div className="max-w-md w-full rounded-3xl border border-rose-500/30 bg-[#131722]/90 p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">Something Went Wrong</h2>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                BuildPilot AI encountered an unexpected application error. You can refresh the page or return home.
              </p>
            </div>

            {this.state.error && (
              <div className="rounded-xl bg-[#090b10] border border-white/10 p-3 text-left font-mono text-[11px] text-rose-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:shadow-rose-500/25 transition active:scale-95"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reload Page
              </button>
              <a
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 transition active:scale-95"
              >
                <Home className="h-3.5 w-3.5" /> Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;

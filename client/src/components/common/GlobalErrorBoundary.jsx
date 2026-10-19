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
        <div className="relative flex min-h-screen items-center justify-center overflow-x-clip bg-bg p-6 text-fg">
          <div
            aria-hidden="true"
            className="orb orb-drift-1 -left-20 -top-[120px] h-[360px] w-[360px]"
            style={{ background: "var(--orb-1)" }}
          />
          <div className="card anim-up relative w-full max-w-md space-y-6 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-err-bg text-err-fg">
              <AlertTriangle className="h-7 w-7" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-4xl font-normal leading-none">Something went wrong</h2>
              <p className="text-sm leading-relaxed text-muted">
                BuildPilot AI encountered an unexpected application error. You can refresh the page or return home.
              </p>
            </div>

            {this.state.error && (
              <div
                role="alert"
                className="max-h-32 overflow-y-auto whitespace-pre-wrap rounded-xl border border-line bg-editor p-3 text-left font-mono text-[11px] text-err-fg"
              >
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button type="button" onClick={this.handleReset} className="btn btn-primary h-11 px-5">
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reload page
              </button>
              <a href="/dashboard" className="btn btn-ghost h-11 px-5">
                <Home className="h-4 w-4" aria-hidden="true" /> Dashboard
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

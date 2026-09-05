import React, { Component, ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center p-4">
          <div className="bg-white border border-[#ded7cb] rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-cinzel text-xl font-bold text-neutral-900 mb-2">
              The Financial Dispatch
            </h2>
            <p className="text-sm text-neutral-600 mb-4">
              An unexpected render issue occurred while loading this intelligence screen.
            </p>
            {this.state.error && (
              <pre className="bg-neutral-100 p-3 rounded text-left text-xs text-rose-700 overflow-x-auto mb-6 max-h-36">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Intelligence Feed</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

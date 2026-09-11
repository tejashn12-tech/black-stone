import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('UI component boundary captured error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-2">Black Stone Fitness</h2>
            <p className="text-zinc-400 text-sm mb-4">
              The application recovered from an unexpected rendering interruption. Please reload to refresh the view.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-sm font-semibold transition"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

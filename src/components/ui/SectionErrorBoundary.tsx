"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary per section untuk mencegah satu error merusak seluruh halaman.
 * Harus berupa class component karena React belum support function component error boundaries.
 */
export class SectionErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Log ke monitoring service (Sentry, dll) di production
    console.error(`[ErrorBoundary] Section: ${this.props.sectionName}`, error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="card p-8 text-center"
          role="alert"
          aria-label={`Error pada bagian ${this.props.sectionName ?? "halaman"}`}
        >
          <AlertTriangle className="w-10 h-10 text-danger mx-auto mb-3" aria-hidden="true" />
          <h3 className="font-heading font-700 text-text-primary mb-2">
            Aduh, ada yang error nih 😅
          </h3>
          <p className="text-text-secondary text-sm mb-4">
            {this.props.sectionName && (
              <span className="font-medium">{this.props.sectionName} </span>
            )}
            gagal dimuat. Coba refresh atau klik tombol di bawah.
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

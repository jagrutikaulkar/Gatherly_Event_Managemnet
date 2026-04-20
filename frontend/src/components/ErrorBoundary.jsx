import React, { Component } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Firestore Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path}`;
            isFirestoreError = true;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-red-600">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              {errorMessage}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <RefreshCcw className="w-5 h-5" />
                <span>Reload Application</span>
              </button>
              <a
                href="/"
                className="w-full flex items-center justify-center space-x-2 bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </a>
            </div>
            {isFirestoreError && (
              <p className="mt-8 text-xs text-gray-400 italic">
                This might be due to missing permissions. Please ensure you are logged in with the correct account.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

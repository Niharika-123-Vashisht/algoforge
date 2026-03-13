import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-3">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-slate-300">Please refresh the page and try again.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught frontend error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
          <span className="text-5xl">😕</span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            An unexpected error occurred. Your data is safe — try reloading the page.
          </p>
          <button onClick={this.handleReload} className="btn-primary mt-6">
            Reload SkillBridge
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
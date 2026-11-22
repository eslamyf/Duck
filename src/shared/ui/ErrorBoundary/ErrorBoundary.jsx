import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <section
          className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-surface-sand"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-brand-navy/10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-navy text-2xl font-black">
              !
            </div>
            <h2 className="text-xl font-heading font-extrabold text-brand-navy mb-2">
              حدث خطأ أثناء تحميل المحتوى
            </h2>
            <p className="text-sm text-brand-navy/70 mb-6 leading-relaxed">
              يرجى إعادة تحميل الصفحة أو التأكد من تحديث الكاش بالضغط على Ctrl + F5.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-brand-yellow text-brand-navy font-bold text-sm shadow hover:bg-brand-navy hover:text-white transition-colors cursor-pointer"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

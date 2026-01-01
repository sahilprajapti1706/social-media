import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                        <div className="flex items-center justify-center mb-6">
                            <AlertCircle className="h-16 w-16 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 text-center mb-6">
                            We're sorry for the inconvenience. The application encountered an unexpected error.
                        </p>
                        {import.meta.env.DEV && this.state.error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-sm font-mono text-red-800 break-words">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                        <div className="flex gap-4">
                            <Button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                Go Home
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="flex-1"
                            >
                                Reload Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

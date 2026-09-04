// ============================================
// ERROR MESSAGE COMPONENT
// ============================================
// Reusable error display component

import React from 'react';

const ErrorMessage = ({ 
    message, 
    type = 'error', 
    onRetry = null, 
    onDismiss = null,
    className = '' 
}) => {

    const typeStyles = {
        error: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            text: 'text-red-400',
            icon: '❌',
            title: 'Error'
        },
        warning: {
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/30',
            text: 'text-yellow-400',
            icon: '⚠️',
            title: 'Warning'
        },
        info: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
            text: 'text-blue-400',
            icon: 'ℹ️',
            title: 'Info'
        },
        success: {
            bg: 'bg-green-500/10',
            border: 'border-green-500/30',
            text: 'text-green-400',
            icon: '✅',
            title: 'Success'
        }
    };

    const style = typeStyles[type] || typeStyles.error;

    if (!message) return null;

    return (
        <div 
            className={`${style.bg} border ${style.border} rounded-xl p-4 
                animate-fade-in ${className}`}
            role="alert"
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <span className="text-lg flex-shrink-0 mt-0.5">
                    {style.icon}
                </span>

                {/* Content */}
                <div className="flex-1">
                    {/* Title */}
                    <h4 className={`${style.text} font-semibold text-sm mb-1`}>
                        {style.title}
                    </h4>

                    {/* Message - string ya array ho sakta hai */}
                    {typeof message === 'string' ? (
                        <p className="text-dark-200 text-sm leading-relaxed">
                            {message}
                        </p>
                    ) : Array.isArray(message) ? (
                        <ul className="text-dark-200 text-sm space-y-1">
                            {message.map((msg, index) => (
                                <li key={index} className="flex items-start gap-1.5">
                                    <span className="text-dark-300 mt-1">•</span>
                                    <span>{msg}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-dark-200 text-sm">{String(message)}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-3">
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className={`${style.text} text-xs font-medium 
                                    hover:underline transition-all 
                                    flex items-center gap-1`}
                            >
                                🔄 Try Again
                            </button>
                        )}
                    </div>
                </div>

                {/* Dismiss Button */}
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-dark-200 hover:text-dark-100 
                            transition-colors flex-shrink-0 p-1 
                            rounded-lg hover:bg-dark-300/50"
                        aria-label="Dismiss"
                    >
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 16 16" 
                            fill="none"
                        >
                            <path 
                                d="M12 4L4 12M4 4L12 12" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

// ============================================
// EMPTY STATE COMPONENT
// ============================================
export const EmptyState = ({ 
    icon = '📭', 
    title = 'No data found',
    message = '',
    actionLabel = '',
    onAction = null 
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
            <span className="text-6xl mb-4 animate-bounce">{icon}</span>
            <h3 className="text-dark-100 font-semibold text-lg mb-2">
                {title}
            </h3>
            {message && (
                <p className="text-dark-200 text-sm text-center max-w-md mb-6">
                    {message}
                </p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="btn-primary text-sm"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

// ============================================
// NETWORK ERROR COMPONENT
// ============================================
export const NetworkError = ({ onRetry }) => {
    return (
        <ErrorMessage
            type="error"
            message="Unable to connect to the server. Please check your internet connection and try again."
            onRetry={onRetry}
        />
    );
};

// ============================================
// INLINE ERROR (for form fields)
// ============================================
export const InlineError = ({ message }) => {
    if (!message) return null;
    
    return (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1 
            animate-fade-in">
            <span>⚠️</span> {message}
        </p>
    );
};

export default ErrorMessage;
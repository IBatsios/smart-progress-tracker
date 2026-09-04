import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = '' }) => {
    const sizeClasses = {
        small: 'w-5 h-5',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`${sizeClasses[size]} animate-spin rounded-full 
                border-2 border-dark-300 border-t-primary-500`} 
            />
            {text && <p className="text-dark-200 text-sm">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className = "flex justify-center items-center p-12 w-full",
  size = "lg"
}) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-t-2 border-b-2"
  };

  return (
    <div className={className}>
      <div className={`animate-spin rounded-full border-indigo-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;

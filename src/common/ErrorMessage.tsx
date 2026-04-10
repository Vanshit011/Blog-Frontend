import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { ErrorResponse } from '../shared/constants/types';

const ErrorMessage: React.FC<ErrorResponse> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 mt-4 text-sm text-red-600 bg-red-50 rounded-lg">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;

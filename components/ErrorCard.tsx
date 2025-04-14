"use client";

import React from "react";

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="container mx-auto px-4 my-8 flex justify-center">
      <div className="max-w-md w-full bg-red-50 border border-red-100 text-red-600 p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-base mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-md transition-colors duration-200"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

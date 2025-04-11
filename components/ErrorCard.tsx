"use client";

import React from "react";

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="max-w-lg w-full bg-red-50 border border-red-200 text-red-600 p-4 rounded shadow mx-auto my-8">
      <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
      <p className="mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded"
        >
          Retry
        </button>
      )}
    </div>
  );
}

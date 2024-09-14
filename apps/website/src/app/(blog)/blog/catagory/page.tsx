"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@amaxa/ui/button";

export default function Page() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg p-8 text-center shadow-lg">
        <svg
          className="mx-auto mb-8 h-48 w-48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="11" stroke="#3B82F6" strokeWidth="2" />
          <path
            d="M12 8V12"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1" fill="#3B82F6" />
        </svg>
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Under Maintenance
        </h1>
        <p className="mb-8 text-gray-600">
          We're currently updating our site to bring you an even better
          experience. Please check back soon!
        </p>
        <Button
          onClick={handleRefresh}
          className="inline-flex items-center rounded-md px-4 py-2 text-white transition-colors "
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Refresh Page
        </Button>
      </div>
    </div>
  );
}

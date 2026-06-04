import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="text-7xl font-black gradient-text mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-gray-400 mb-8">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-500 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

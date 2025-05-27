
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-text">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <Link to="/dashboard" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
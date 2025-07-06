import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12">
      <div className="container-custom max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <div className="text-9xl font-bold text-primary-200 select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-16 h-16 text-primary-400" />
              </div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-secondary-600 mb-8 text-lg">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              to="/"
              className="btn-primary w-full flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn-outline w-full flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 p-4 bg-secondary-100 rounded-lg">
            <h3 className="font-medium text-secondary-900 mb-2">
              Need help?
            </h3>
            <p className="text-sm text-secondary-600">
              Try searching for what you're looking for or browse our categories.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound; 
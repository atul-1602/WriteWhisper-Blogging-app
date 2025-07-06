import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, BookOpen } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-9xl font-bold gradient-text mb-4"
          >
            404
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-24 h-24 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <BookOpen className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-3xl font-bold text-secondary-900 mb-4"
          >
            Page Not Found
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-secondary-600 mb-8"
          >
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="btn-primary group"
              >
                <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Go Home
              </Link>
              
              <Link
                to="/search"
                className="btn-outline group"
              >
                <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Search Blogs
              </Link>
            </div>

            <button
              onClick={() => window.history.back()}
              className="btn-ghost group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Go Back
            </button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-12 pt-8 border-t border-secondary-200"
          >
            <h3 className="text-sm font-medium text-secondary-700 mb-4">
              Popular Pages
            </h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/search"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Search
              </Link>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Register
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound; 
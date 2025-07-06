import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Home, 
  Search, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  BookOpen,
  Settings,
  Bookmark
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BookOpen },
    { name: 'Create Blog', href: '/create-blog', icon: Plus },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Navigation */}
      <nav className="bg-white shadow-soft border-b border-secondary-200 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">WriteWhisper</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/create-blog"
                      className="btn-primary btn-sm hidden sm:flex"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Write
                    </Link>
                    
                    <div className="relative group">
                      <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                        <img
                          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=3b82f6&color=fff`}
                          alt={user?.firstName}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="hidden sm:block text-sm font-medium text-secondary-700">
                          {user?.firstName}
                        </span>
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong border border-secondary-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-1">
                          {userNavigation.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.name}
                                to={item.href}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 hover:text-primary-600 transition-colors duration-200"
                              >
                                <Icon className="w-4 h-4" />
                                <span>{item.name}</span>
                              </Link>
                            );
                          })}
                          <hr className="my-1 border-secondary-200" />
                          <button
                            onClick={logout}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="btn-outline btn-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary btn-sm">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-secondary-600 hover:text-primary-600 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {isAuthenticated && (
                <>
                  <hr className="my-2 border-secondary-200" />
                  {userNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  <hr className="my-2 border-secondary-200" />
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary-200 mt-16">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">WriteWhisper</span>
              </div>
              <p className="text-secondary-600 max-w-md">
                Share your thoughts, stories, and knowledge with the world. 
                Join our community of writers and readers.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-secondary-900 mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                    Search
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                    Categories
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-secondary-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-200 mt-8 pt-8 text-center">
            <p className="text-secondary-500 text-sm">
              © 2024 WriteWhisper. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 
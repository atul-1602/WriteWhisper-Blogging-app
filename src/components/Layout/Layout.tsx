'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Bookmark
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50 overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-md shadow-soft border-b border-secondary-200/50 sticky top-0 z-50"
      >
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-soft"
              >
                <BookOpen className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-200">
                WriteWhisper
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive(item.href)
                          ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-accent-50 shadow-soft'
                          : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 hover:shadow-soft'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl transition-all duration-200 shadow-soft hover:shadow-medium"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/create-blog"
                        className="btn-primary btn-sm shadow-soft hover:shadow-medium transition-all duration-300 inline-flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Write
                      </Link>

                    </motion.div>

                    <div className="relative group">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gradient-to-r from-primary-50 to-accent-50 transition-all duration-200 shadow-soft hover:shadow-medium"
                      >
                        <img
                          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}+${user?.lastName || ''}&background=3b82f6&color=fff`}
                          alt={`${user?.firstName || 'User'} ${user?.lastName || ''}`}
                          className="w-8 h-8 rounded-full ring-2 ring-secondary-200"
                        />
                        <span className="hidden sm:block text-sm font-medium text-secondary-700">
                          {user?.firstName || 'User'} {user?.lastName || ''}
                        </span>
                      </motion.button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-strong border border-secondary-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                        >
                          <div className="py-1">
                            {userNavigation.map((item) => {
                              const Icon = item.icon;
                              return (
                                <motion.div
                                  key={item.name}
                                  whileHover={{ x: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Link
                                    href={item.href}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-gradient-to-r from-primary-50 to-accent-50 hover:text-primary-600 transition-colors duration-200"
                                  >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                  </Link>
                                </motion.div>
                              );
                            })}
                            <hr className="my-1 border-secondary-200" />
                            <motion.button
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                              onClick={logout}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/login" className="btn-outline btn-sm shadow-soft hover:shadow-medium">
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/signup" className="btn-primary btn-sm shadow-soft hover:shadow-medium transition-all duration-300">
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-secondary-600 hover:text-primary-600 hover:bg-secondary-100 rounded-xl transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-secondary-200/50 bg-white/95 backdrop-blur-md"
            >
              <div className="px-4 py-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.href)
                            ? 'text-primary-600 bg-primary-50 shadow-soft'
                            : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
                          }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
                {isAuthenticated && (
                  <>
                    <hr className="my-2 border-secondary-200" />
                    {userNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.name}
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                    <hr className="my-2 border-secondary-200" />
                    <motion.button
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </motion.button>
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <hr className="my-2 border-secondary-200" />
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/login" className="btn-outline btn-sm w-full block text-center mb-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/signup" className="btn-primary btn-sm w-full block text-center" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white/90 backdrop-blur-md border-t border-secondary-200/50 mt-16"
      >
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center shadow-soft"
                >
                  <BookOpen className="w-5 h-5 text-white" />
                </motion.div>
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
                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link href="/" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                      Home
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link href="/search" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                      Search
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link href="/categories" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                      Categories
                    </Link>
                  </motion.div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-secondary-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link href="/help" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                      Help Center
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link href="/contact" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                      Contact Us
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link href="/privacy" className="text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                      Privacy Policy
                    </Link>
                  </motion.div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-200/50 mt-8 pt-8 text-center">
            <p className="text-secondary-500 text-sm">
              © 2024 WriteWhisper. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout; 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Bookmark, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'bookmarks', name: 'Bookmarks', icon: Bookmark },
    { id: 'likes', name: 'Likes', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {/* Header */}
          <div className="p-8 border-b border-secondary-200">
            <div className="flex items-center space-x-6">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=3b82f6&color=fff`}
                alt={user?.firstName}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold text-secondary-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-secondary-600">@{user?.username}</p>
                {user?.bio && (
                  <p className="text-secondary-600 mt-2">{user.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Profile Management
                </h3>
                <p className="text-secondary-600">
                  Profile editing functionality coming soon!
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Settings
                </h3>
                <p className="text-secondary-600">
                  Settings management coming soon!
                </p>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="text-center py-12">
                <Bookmark className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Bookmarks
                </h3>
                <p className="text-secondary-600">
                  Your bookmarked articles will appear here.
                </p>
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Liked Articles
                </h3>
                <p className="text-secondary-600">
                  Articles you've liked will appear here.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 
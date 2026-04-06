import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Calendar, PlusCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, isOrganizer } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
              <Calendar className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              GATHERLY
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            <Link to="/events" className="text-gray-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors">
              Discover
            </Link>
            {user ? (
              <>
                {isOrganizer && (
                  <Link to="/create-event" className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors">
                    <PlusCircle className="w-4 h-4" />
                    <span>Create</span>
                  </Link>
                )}
                <Link to="/dashboard" className="text-gray-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-6 pl-6 border-l border-gray-100">
                  <Link to="/profile" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-indigo-600 transition-all shadow-sm">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-none mb-1">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                        {user?.role}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-gray-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 active:scale-95"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-2xl"
          >
            <div className="px-6 pt-4 pb-10 space-y-4">
              <Link to="/events" onClick={() => setIsMenuOpen(false)} className="block py-4 text-gray-900 font-black text-lg uppercase tracking-widest border-b border-gray-50">Discover</Link>
              {user ? (
                <>
                  {isOrganizer && <Link to="/create-event" onClick={() => setIsMenuOpen(false)} className="block py-4 text-gray-900 font-black text-lg uppercase tracking-widest border-b border-gray-50">Create Event</Link>}
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block py-4 text-gray-900 font-black text-lg uppercase tracking-widest border-b border-gray-50">Dashboard</Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block py-4 text-gray-900 font-black text-lg uppercase tracking-widest border-b border-gray-50">Profile</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left py-4 text-red-600 font-black text-lg uppercase tracking-widest">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block py-4 text-gray-900 font-black text-lg uppercase tracking-widest border-b border-gray-50">Log in</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block py-4 text-indigo-600 font-black text-lg uppercase tracking-widest">Sign up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

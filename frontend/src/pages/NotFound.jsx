import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <h1 className="text-[12rem] font-black text-gray-100 leading-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-24 h-24 text-indigo-600 animate-bounce" />
            </div>
          </div>
        </motion.div>
        
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Page Not Found</h2>
        <p className="text-gray-500 text-lg mb-12">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link 
            to="/events" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Explore Events
          </Link>
        </div>
      </div>
    </div>
  );
}

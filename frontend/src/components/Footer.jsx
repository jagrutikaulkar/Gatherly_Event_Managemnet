import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Github, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Gatherly
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Connecting people through shared interests and unforgettable experiences. Discover, join, and create events that matter.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Platform</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/events" className="hover:text-indigo-600 transition-colors">Discover Events</Link></li>
              <li><Link to="/categories" className="hover:text-indigo-600 transition-colors">Categories</Link></li>
              <li><Link to="/organizers" className="hover:text-indigo-600 transition-colors">Top Organizers</Link></li>
              <li><Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Support</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/help" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
              <li><Link to="/safety" className="hover:text-indigo-600 transition-colors">Safety Center</Link></li>
              <li><Link to="/community" className="hover:text-indigo-600 transition-colors">Community Guidelines</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Stay Connected</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400">
            © 2026 Gatherly Inc. All rights reserved.
          </p>
          <div className="flex space-x-8 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-indigo-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

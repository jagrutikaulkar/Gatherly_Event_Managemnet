import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Filter, X, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { formatDate } from '../lib/utils';

const CATEGORIES = ['All', 'Technology', 'Music', 'Lifestyle', 'Business', 'Art', 'Food', 'Sports'];

export default function EventListing() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const { events, loading } = useEvents(selectedCategory !== 'All' ? { category: selectedCategory } : {});

  useEffect(() => {
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    if (search) setSearchQuery(search);
    if (location) setLocationQuery(location);
  }, [searchParams]);

  const filteredEvents = events.filter(event => 
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    event.location.toLowerCase().includes(locationQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Discover Events</h1>
          <p className="text-gray-500 text-lg">Find experiences that match your passions.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="flex-grow relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Location..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <div className="flex-shrink-0 flex items-center gap-2 text-gray-400 mr-2">
                <Filter className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
              </div>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[16/10] rounded-[2rem] mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => (
                <motion.div
                  key={event._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                >
                  <Link to={`/events/${event._id}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={event.image || `https://picsum.photos/seed/${event._id}/800/600`} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-indigo-600 text-xs font-black mb-3 uppercase tracking-wider">
                        <Calendar className="w-3 h-3 mr-2" />
                        {formatDate(event.date)} • {event.time}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mb-6">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                        {event.location}
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center text-gray-400 text-xs font-bold">
                          <Users className="w-4 h-4 mr-2" />
                          {event.attendeeCount} / {event.capacity}
                        </div>
                        <div className="flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                          Details <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-8 text-indigo-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

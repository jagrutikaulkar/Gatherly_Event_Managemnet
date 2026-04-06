import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Image as ImageIcon, AlignLeft, 
  Tag, Users, Clock, ArrowLeft, Loader2, Save, X
} from 'lucide-react';
import axios from 'axios';

const CATEGORIES = ['Technology', 'Music', 'Lifestyle', 'Business', 'Art', 'Food', 'Sports'];

export default function CreateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createEvent, updateEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Technology',
    capacity: 50,
    image: ''
  });

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          setFetching(true);
          const response = await axios.get(`/api/events/${id}`);
          const event = response.data;
          if (event.organizerId !== user?.id && user?.role !== 'admin') {
            navigate('/dashboard');
            return;
          }
          setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            category: event.category,
            capacity: event.capacity,
            image: event.image
          });
        } catch (err) {
          setError("Failed to fetch event details.");
        } finally {
          setFetching(false);
        }
      };
      fetchEvent();
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (id) {
        await updateEvent(id, formData);
      } else {
        await createEvent(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-indigo-600 transition-all mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-500/5 p-8 md:p-16">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
              {id ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-gray-500 text-lg">Fill in the details to host your next amazing experience.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
              <X className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg font-medium"
                  placeholder="e.g. Summer Music Festival"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none font-medium"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Capacity</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="e.g. Central Park, NY"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-6 text-gray-400 w-5 h-5" />
                  <textarea
                    required
                    rows="5"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="Tell people what this event is about..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Cover Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                {formData.image && (
                  <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 aspect-video">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  {id ? 'Update Event' : 'Publish Event'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

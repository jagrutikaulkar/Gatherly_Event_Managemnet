import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Clock, Share2, Heart, 
  ArrowLeft, ShieldCheck, MessageSquare, Info, 
  AlertCircle, CheckCircle2, Loader2, Edit, Trash2
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import axios from 'axios';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isOrganizer: checkIsOrganizer } = useAuth();
  const { rsvpEvent, deleteEvent } = useEvents();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRSVPing, setIsRSVPing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error("Fetch event error:", err);
        setError("Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRSVP = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setIsRSVPing(true);
      const updatedEvent = await rsvpEvent(id);
      setEvent(updatedEvent);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to RSVP.");
    } finally {
      setIsRSVPing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        navigate('/dashboard');
      } catch (err) {
        setError("Failed to delete event.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">{error}</p>
        <Link to="/events" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
          Back to Events
        </Link>
      </div>
    );
  }

  const isOrganizer = user?.id === event.organizerId;
  const isRSVPed = event.attendees.includes(user?.id);
  const isFull = event.attendeeCount >= event.capacity && !isRSVPed;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={event.image || `https://picsum.photos/seed/${event._id}/1200/800`} 
          alt={event.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
        
        <div className="absolute top-8 left-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-12 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest text-indigo-400 uppercase bg-indigo-400/10 rounded-lg border border-indigo-400/20 backdrop-blur-md">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-300 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  {event.location}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
              <div className="flex border-b border-gray-100">
                {['about', 'attendees', 'discussion'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-all ${
                      activeTab === tab 
                        ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50/50' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-10">
                {activeTab === 'about' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose prose-indigo max-w-none"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">About this event</h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-8">
                      {event.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-gray-900">Organizer</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${event.organizerId}`} alt={event.organizerName} referrerPolicy="no-referrer" />
                          </div>
                          <span className="font-bold text-gray-700">{event.organizerName}</span>
                        </div>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <Users className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-gray-900">Capacity</h4>
                        </div>
                        <p className="text-gray-600 font-bold">{event.capacity} spots available</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'attendees' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Who's coming? ({event.attendeeCount})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {event.attendees.map((attendeeId, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-sm">
                            <img src={`https://i.pravatar.cc/100?u=${attendeeId}`} alt="Attendee" referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Member</span>
                        </div>
                      ))}
                      {event.attendeeCount === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400 font-bold">
                          Be the first to join this event!
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'discussion' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Join the conversation</h3>
                    <p className="text-gray-500 mb-8">Connect with other attendees before the event starts.</p>
                    <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all">
                      Start Discussion
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-indigo-500/5 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <div className="text-3xl font-black text-gray-900">Free</div>
                <div className="flex gap-2">
                  <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-bold text-gray-700">Availability</span>
                  </div>
                  <span className="text-sm font-black text-indigo-600">
                    {event.capacity - event.attendeeCount} spots left
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-bold text-gray-700">Status</span>
                  </div>
                  <span className="text-sm font-black text-green-500 uppercase tracking-widest">
                    {event.status}
                  </span>
                </div>
              </div>

              {isOrganizer ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    to={`/edit-event/${event._id}`}
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all"
                  >
                    <Edit className="w-5 h-5" />
                    Edit
                  </Link>
                  <button 
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRSVP}
                  disabled={isRSVPing || isFull}
                  className={`w-full py-5 rounded-[1.8rem] font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                    isRSVPed 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-red-500/10' 
                      : isFull
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
                  }`}
                >
                  {isRSVPing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isRSVPed ? (
                    <>Cancel RSVP</>
                  ) : isFull ? (
                    <>Event Full</>
                  ) : (
                    <>Join Event</>
                  )}
                </button>
              )}
              
              <div className="mt-8 flex items-start gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                  By joining this event, you agree to follow the community guidelines and the organizer's rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

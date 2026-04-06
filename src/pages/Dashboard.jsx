import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { motion } from 'framer-motion';
import { Calendar, Users, Star, TrendingUp, Plus, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const { user, isOrganizer, getStats } = useAuth();
  const { events: myEvents, loading: eventsLoading } = useEvents(isOrganizer ? { organizerId: user?.id } : {});
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStatsData(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [getStats]);

  const { events: allEvents, loading: allEventsLoading } = useEvents({ limit: 3 });

  const stats = [
    { label: 'Events Joined', value: statsData?.eventsJoined || '0', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Interests', value: statsData?.interestsCount || '0', icon: Users, color: 'bg-purple-500' },
    { label: 'Events Created', value: statsData?.eventsCreated || '0', icon: Star, color: 'bg-yellow-500' },
    { label: 'Points', value: statsData?.points || '0', icon: TrendingUp, color: 'bg-green-500' },
  ];

  const chartData = myEvents.map(e => ({
    name: e.title.length > 10 ? e.title.substring(0, 10) + '...' : e.title,
    attendees: e.attendeeCount,
    capacity: e.capacity
  }));

  const handleInviteFriends = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on Gatherly!',
        text: 'Check out this awesome event platform.',
        url: window.location.origin,
      }).catch(console.error);
    } else {
      alert("Copy this link to invite friends: " + window.location.origin);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-500">Here's what's happening in your community.</p>
        </div>
        {isOrganizer && (
          <Link
            to="/create-event"
            className="flex items-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {isOrganizer && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Event Performance</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f9fafb' }}
                    />
                    <Bar dataKey="attendees" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#8b5cf6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Your Events</h2>
              <Link to="/events" className="text-indigo-600 font-bold text-sm hover:underline">View all</Link>
            </div>
            
            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : myEvents.length > 0 ? (
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <Link
                    key={event._id}
                    to={`/events/${event._id}`}
                    className="flex items-center p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden mr-6 flex-shrink-0">
                      <img src={event.image || `https://picsum.photos/seed/${event._id}/200`} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(event.date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{event.attendeeCount}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Joined</div>
                    </div>
                    <ArrowRight className="ml-6 w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition-all" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-6">You haven't {isOrganizer ? 'created' : 'joined'} any events yet.</p>
                <Link
                  to="/events"
                  className="inline-flex items-center space-x-2 text-indigo-600 font-bold hover:underline"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-20" />
            <h3 className="text-xl font-bold mb-6 relative z-10">Quick Actions</h3>
            <div className="space-y-3 relative z-10">
              <Link to="/events" className="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group">
                <span className="font-bold">Find Local Groups</span>
                <Users className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-all" />
              </Link>
              <button 
                onClick={handleInviteFriends}
                className="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
              >
                <span className="font-bold">Invite Friends</span>
                <Plus className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-all" />
              </button>
              <Link to="/profile" className="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group">
                <span className="font-bold">Update Profile</span>
                <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-all" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Near You</h3>
            <div className="space-y-6">
              {allEventsLoading ? (
                [1, 2].map(i => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)
              ) : allEvents.length > 0 ? (
                allEvents.map((event) => (
                  <Link key={event._id} to={`/events/${event._id}`} className="flex space-x-4 group">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex flex-col items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <span className="text-[8px] font-black uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg font-black leading-none">{new Date(event.date).getDate()}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{event.title}</h4>
                      <div className="flex items-center text-[10px] text-gray-400 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">No upcoming events found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

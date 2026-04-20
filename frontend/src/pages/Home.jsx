import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, TrendingUp, ShieldCheck, Zap, Globe, Heart } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { formatDate } from '../lib/utils';

export default function Home() {
  const { events, loading } = useEvents({ limit: 6 });
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const handleExplore = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (locationQuery) params.append('location', locationQuery);
    navigate(`/events?${params.toString()}`);
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 pt-16">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/70 to-gray-900" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 mb-8 text-sm font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 rounded-full border border-indigo-400/20 backdrop-blur-md"
            >
              <Zap className="w-4 h-4 mr-2 fill-indigo-400" />
              Discover Your Next Experience
            </motion.span>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-[0.9]">
              GATHER <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
                TOGETHER
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              The world's most interactive platform for discovering local events, building communities, and sharing passions.
            </p>

            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl p-3 rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1 w-full flex items-center px-6 py-4 bg-white/5 rounded-3xl border border-white/10 focus-within:bg-white/10 transition-all">
                <Search className="text-indigo-400 w-6 h-6 mr-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?" 
                  className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400 text-lg"
                />
              </div>
              <div className="flex-1 w-full flex items-center px-6 py-4 bg-white/5 rounded-3xl border border-white/10 focus-within:bg-white/10 transition-all">
                <MapPin className="text-indigo-400 w-6 h-6 mr-4" />
                <input 
                  type="text" 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Location" 
                  className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400 text-lg"
                />
              </div>
              <button 
                onClick={handleExplore}
                className="w-full md:w-auto bg-indigo-600 text-white px-10 py-5 rounded-[1.8rem] font-black text-lg hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/40 active:scale-95"
              >
                EXPLORE
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400 font-bold uppercase tracking-widest text-xs">
              <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> 50+ Cities</div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4" /> 1M+ Members</div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4" /> 4.9/5 Rating</div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Trending Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">TRENDING NOW</h2>
              <p className="text-gray-500 text-xl font-medium">The hottest experiences happening around you.</p>
            </div>
            <Link to="/events" className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all">
              View All Events <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 aspect-[16/10] rounded-[2.5rem] mb-6" />
                  <div className="h-8 bg-gray-100 rounded-xl w-3/4 mb-4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {events.map((event, idx) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(79,70,229,0.15)] transition-all duration-500"
                >
                  <Link to={`/events/${event._id}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={event.image || `https://picsum.photos/seed/${event._id}/800/600`} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-indigo-600 text-xs font-black rounded-xl uppercase tracking-widest shadow-xl">
                          {event.category}
                        </span>
                      </div>
                      <button className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center text-indigo-600 text-sm font-black mb-4 uppercase tracking-wider">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(event.date)} • {event.time}
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-gray-500 font-medium mb-6">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                        {event.location}
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex -space-x-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                              <img src={`https://i.pravatar.cc/100?u=${event._id}${i}`} alt="Attendee" referrerPolicy="no-referrer" />
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                            +{event.attendeeCount}
                          </div>
                        </div>
                        <span className="bg-indigo-50 text-indigo-600 px-5 py-2 rounded-xl font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          JOIN NOW
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Features */}
      <section className="py-32 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-indigo-400 font-black tracking-[0.2em] uppercase text-sm mb-6 block"
              >
                The Gatherly Advantage
              </motion.span>
              <h2 className="text-6xl font-black mb-10 tracking-tighter leading-[0.9]">
                BUILT FOR <br />
                <span className="text-indigo-500">CONNECTION.</span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed font-medium">
                We've reimagined how communities interact. From real-time updates to AI-powered recommendations, Gatherly is the future of social discovery.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: TrendingUp, title: "Smart Discovery", desc: "Our AI learns your interests to suggest events you'll actually love." },
                  { icon: ShieldCheck, title: "Verified Safety", desc: "Every organizer is vetted to ensure high-quality, safe experiences." },
                  { icon: Zap, title: "Instant Access", desc: "One-tap RSVP and digital tickets for a seamless entry experience." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="flex-shrink-0 w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-indigo-400">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl shadow-indigo-500/20">
                <img 
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1000" 
                  alt="Feature" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl hidden md:block">
                <div className="text-4xl font-black mb-2">98%</div>
                <div className="text-indigo-200 font-bold text-sm uppercase tracking-wider">Satisfaction Rate</div>
                <div className="mt-8 flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=stat${i}`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative bg-indigo-600 rounded-[4rem] p-16 md:p-32 overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-full h-full opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px] -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-400 rounded-full blur-[100px] -ml-48 -mb-48" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-none">
                START YOUR <br /> OWN STORY.
              </h2>
              <p className="text-indigo-100 text-xl md:text-2xl mb-12 font-medium">
                Join 10,000+ organizers building the future of social experiences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="w-full sm:w-auto bg-white text-indigo-600 px-12 py-6 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl">
                  GET STARTED
                </Link>
                <Link to="/help" className="w-full sm:w-auto border-2 border-white/30 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-white/10 transition-all">
                  LEARN MORE
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

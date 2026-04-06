import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Edit, Save, X, Loader2, Camera, Tag } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    photoURL: user?.photoURL || '',
    interests: user?.interests?.join(', ') || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const profileData = {
        ...formData,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i !== '')
      };
      await updateProfile(profileData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-500/5 overflow-hidden">
        {/* Header/Cover */}
        <div className="h-48 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
          <div className="absolute -bottom-16 left-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl">
                <div className="w-full h-full rounded-[2rem] bg-gray-100 overflow-hidden border-4 border-white">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-full h-full p-6 text-gray-300" />
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white w-8 h-8" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-24 pb-12 px-12">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{user?.name}</h1>
              <div className="flex items-center gap-4 text-gray-500 font-bold">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs uppercase tracking-widest">
                  <Shield className="w-3 h-3" />
                  {user?.role}
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {error && <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm">{error}</div>}
          {success && <div className="mb-8 p-4 bg-green-50 text-green-600 rounded-2xl font-bold text-sm">{success}</div>}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Display Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Photo URL</label>
                  <input
                    type="url"
                    value={formData.photoURL}
                    onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Bio</label>
                <textarea
                  rows="4"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Interests (comma separated)</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="e.g. Technology, Music, Art"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">About Me</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  {user?.bio || "No bio added yet. Tell the community about yourself!"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Interests</h3>
                <div className="flex flex-wrap gap-3">
                  {user?.interests?.length > 0 ? (
                    user.interests.map((interest, i) => (
                      <span key={i} className="px-6 py-3 bg-gray-50 text-gray-700 rounded-2xl font-bold text-sm border border-gray-100">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No interests listed.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

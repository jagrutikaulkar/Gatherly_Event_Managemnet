import { useState, useEffect } from 'react';
import axios from 'axios';

export const useEvents = (filters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(filters);
        const response = await axios.get(`/api/events?${params.toString()}`);
        setEvents(response.data);
      } catch (err) {
        console.error("Fetch events error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [JSON.stringify(filters)]);

  const createEvent = async (eventData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/events', eventData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEvents(prev => [...prev, response.data]);
    return response.data;
  };

  const updateEvent = async (id, eventData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`/api/events/${id}`, eventData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEvents(prev => prev.map(e => e._id === id ? response.data : e));
    return response.data;
  };

  const deleteEvent = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEvents(prev => prev.filter(e => e._id !== id));
  };

  const rsvpEvent = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`/api/events/${id}/rsvp`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEvents(prev => prev.map(e => e._id === id ? response.data : e));
    return response.data;
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpEvent
  };
};

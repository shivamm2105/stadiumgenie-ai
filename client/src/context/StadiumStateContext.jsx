import React, { createContext, useState, useEffect } from 'react';
import { ApiService } from '../services/api';

export const StadiumStateContext = createContext();

export function StadiumStateProvider({ children }) {
  const [data, setData] = useState({
    gates: [],
    parking: [],
    foodCourts: [],
    incidents: [],
    lostAndFound: [],
    volunteers: [],
    matchInfo: { teams: { home: '', away: '' }, venue: '', timeToKickoff: 45, emergencyAlert: null },
    maintenanceTickets: [],
    volunteerTasks: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await ApiService.getStatus();
      setData(res);
      setError(null);
    } catch (err) {
      console.error('Failed to sync operations state:', err);
      setError('Connection sync delayed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Poll for live telemetry and emergency alerts every 5 seconds
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshState = () => {
    fetchStatus();
  };

  return (
    <StadiumStateContext.Provider value={{
      ...data,
      loading,
      error,
      refreshState
    }}>
      {children}
    </StadiumStateContext.Provider>
  );
}

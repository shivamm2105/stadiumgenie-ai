import { useContext } from 'react';
import { StadiumStateContext } from '../context/StadiumStateContext';

/**
 * Custom hook to consume real-time stadium operations and telemetry state.
 * @returns {object} Stadium telemetry context containing:
 * - gates: array
 * - parking: array
 * - foodCourts: array
 * - incidents: array
 * - lostAndFound: array
 * - volunteers: array
 * - matchInfo: object
 * - maintenanceTickets: array
 * - volunteerTasks: array
 * - loading: boolean
 * - error: string|null
 * - refreshState: function
 */
export function useStadiumState() {
  const context = useContext(StadiumStateContext);
  if (!context) {
    throw new Error('useStadiumState must be used within a StadiumStateProvider');
  }
  return context;
}

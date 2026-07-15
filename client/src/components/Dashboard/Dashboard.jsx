import { useEffect, useRef, useState } from 'react';
import { getLeads } from '../../services/api';
import { connectSocket } from '../../services/socket';
import LeadTable from './LeadTable';
import AnalyticsBadges from './AnalyticsBadges';
import './Dashboard.css';

const RECONNECT_DELAY_MS = 3000;

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const isMountedRef = useRef(true);
  const hasConnectedOnceRef = useRef(false);
  const reconnectTimeoutRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;

    function loadLeads() {
      return getLeads()
        .then((data) => {
          if (!isMountedRef.current) return;
          setLeads(data);
          setStatus('ready');
          setError(null);
        })
        .catch((err) => {
          if (!isMountedRef.current) return;
          setError(err.message);
          setStatus('error');
        });
    }

    function openSocket() {
      socketRef.current = connectSocket({
        onOpen: () => {
          if (!isMountedRef.current) return;
          setIsConnected(true);

          // Re-fetch on every reconnect (not the first connection, which the
          // initial loadLeads() call already covers) to backfill any leads
          // created while this dashboard was disconnected.
          if (hasConnectedOnceRef.current) {
            loadLeads();
          }
          hasConnectedOnceRef.current = true;
        },
        onMessage: (message) => {
          if (message.type === 'lead_created') {
            setLeads((prev) => [...prev, message.data]);
          }
        },
        onClose: () => {
          if (!isMountedRef.current) return;
          setIsConnected(false);
          reconnectTimeoutRef.current = setTimeout(openSocket, RECONNECT_DELAY_MS);
        },
      });
    }

    loadLeads();
    openSocket();

    return () => {
      isMountedRef.current = false;
      clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close();
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Lead Dashboard</h1>

      <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? 'Live' : 'Reconnecting…'}
      </div>

      {status === 'loading' && <p>Loading leads...</p>}

      {status === 'error' && <p className="dashboard-error">{error}</p>}

      {status === 'ready' && (
        <>
          <AnalyticsBadges leads={leads} />
          <LeadTable leads={leads} />
        </>
      )}
    </div>
  );
}

export default Dashboard;

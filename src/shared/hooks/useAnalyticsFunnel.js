import { useState, useEffect, useCallback } from 'react';
import {
  getFunnelMetrics,
  getAnalyticsEvents,
  clearAnalyticsLog,
  ANALYTICS_UPDATED_EVENT,
} from '../utils/analytics.js';

export function useAnalyticsFunnel() {
  const [metrics, setMetrics] = useState(getFunnelMetrics);
  const [events, setEvents] = useState(getAnalyticsEvents);

  const refresh = useCallback(() => {
    setMetrics(getFunnelMetrics());
    setEvents(getAnalyticsEvents());
  }, []);

  useEffect(() => {
    window.addEventListener(ANALYTICS_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(ANALYTICS_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  return {
    metrics,
    events,
    refresh,
    clearLog: clearAnalyticsLog,
  };
}

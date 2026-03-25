import { useEffect, useState } from 'react';
import { statsAPI } from '../services/api/stats';
import { UserStats } from '../types';

export const useStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await statsAPI.getStats();
        setStats(data);
      } catch (e: unknown) {
        setError('Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
};
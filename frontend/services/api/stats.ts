import { apiClient } from './client';
import { UserStats } from '../../types';

export const statsAPI = {
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get('/user/stats');
    return response.data.data;
  },
};
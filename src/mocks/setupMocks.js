import axios from 'axios';
import { mockCommunications } from './mockData';

if (process.env.NODE_ENV === 'development') {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.config.url === '/api/communications') {
        return Promise.resolve({
          data: mockCommunications,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config
        });
      }
      return Promise.reject(error);
    }
  );
} 
const BASE_URL = 'http://localhost:8080/api/v1';

export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null') return null;
  return token;
};

export const api = {
  get: async <T>(endpoint: string, isRetry = false): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if ((response.status === 401 || response.status === 403) && !isRetry) {
      localStorage.removeItem('token');
      return api.get<T>(endpoint, true);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Network response was not ok');
    }
    return response.json();
  },

  post: async <T>(endpoint: string, data: any, isRetry = false): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    if ((response.status === 401 || response.status === 403) && !isRetry) {
      localStorage.removeItem('token');
      return api.post<T>(endpoint, data, true);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Network response was not ok');
    }
    return response.json();
  },

  put: async <T>(endpoint: string, data?: any, isRetry = false): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if ((response.status === 401 || response.status === 403) && !isRetry) {
      localStorage.removeItem('token');
      return api.put<T>(endpoint, data, true);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Network response was not ok');
    }
    return response.json();
  },
};

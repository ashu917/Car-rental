import { useState, useCallback } from 'react';
import { useAppContext } from '../Components/Context/AppContext';
import { toast } from 'react-hot-toast';

export const useCarDetailsQuery = () => {
  const { axios } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ items: [], meta: null });
  const [error, setError] = useState(null);

  const fetchCars = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/api/gemini/carDetails', { params });
      if (data?.success) {
        const items = Array.isArray(data.data) ? data.data : [];
        setData({ items, meta: data.meta || null });
      } else {
        toast.error(data?.message || 'Failed to load cars');
      }
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || err.message || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  }, [axios]);

  return { loading, data, error, fetchCars };
};

export const useAskGemini = () => {
  const { axios } = useAppContext();
  const [loading, setLoading] = useState(false);

  const ask = useCallback(async (prompt) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/gemini/ask', { prompt });
      if (data?.success) {
        return data?.data?.text || data?.message || '';
      }
      toast.error(data?.message || 'AI request failed');
      return '';
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'AI request failed');
      return '';
    } finally {
      setLoading(false);
    }
  }, [axios]);

  return { loading, ask };
};

export default { useCarDetailsQuery, useAskGemini };

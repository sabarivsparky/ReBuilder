import { useState } from 'react';
import { generateResume as apiGenerateResume } from '../services/api';

export const useResumeGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const generateResume = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await apiGenerateResume(formData);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, result, generateResume, setResult };
};

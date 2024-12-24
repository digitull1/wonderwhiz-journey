import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useImageGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (prompt: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (error) throw error;
      return data.image;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateImage, isLoading, error };
};
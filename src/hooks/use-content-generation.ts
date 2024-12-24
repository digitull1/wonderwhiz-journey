import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useContentGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateContent = async (topic: string) => {
    setIsLoading(true);
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('age')
        .single();

      const userAge = profileData?.age || 8;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { topic, userAge }
      });

      if (error) throw error;

      console.log('Generated content:', data);
      return data;
    } catch (error) {
      console.error('Error generating content:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateContent,
    isLoading
  };
};
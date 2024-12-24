import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Topic {
  title: string;
  description: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ageRange: string;
  category: string;
}

interface ContentDetails {
  explanation: string;
  facts: string[];
  followUpQuestions: string[];
}

export const useContentGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTopics = async (): Promise<Topic[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'topics' },
      });

      if (error) throw error;
      return data.content;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate topics');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const generateContent = async (topic: string): Promise<ContentDetails | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'content', prompt: topic },
      });

      if (error) throw error;
      return data.content;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateTopics, generateContent, isLoading, error };
};
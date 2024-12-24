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

interface ContentBlock {
  title: string;
  description: string;
  topic: string;
  age_range: number[];
  metadata: {
    icon?: string;
    difficulty?: "Easy" | "Medium" | "Hard";
  };
}

export const useContentGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateContent = async (topic: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('age')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

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

  const generateTopics = async (): Promise<Topic[]> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('age')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const userAge = profileData?.age || 8;

      // First try to get topics from the content_blocks table using proper range syntax
      const { data: existingTopics, error: topicsError } = await supabase
        .from('content_blocks')
        .select('*')
        .overlaps('age_range', `[${userAge},${userAge}]`);

      if (existingTopics && existingTopics.length > 0) {
        return (existingTopics as ContentBlock[]).map(topic => ({
          title: topic.title,
          description: topic.description,
          icon: topic.metadata?.icon || '✨',
          difficulty: topic.metadata?.difficulty || 'Easy',
          ageRange: `${topic.age_range[0]}-${topic.age_range[1]}`,
          category: topic.topic
        }));
      }

      // If no topics found, generate them using the edge function
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          type: 'topics',
          userAge 
        }
      });

      if (error) throw error;

      return data.topics || [];
    } catch (error) {
      console.error('Error generating topics:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateContent,
    generateTopics,
    isLoading
  };
};
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { Message } from "./chat/types";
import confetti from "canvas-confetti";
import { useContentGeneration } from "@/hooks/use-content-generation";

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const { generateContent } = useContentGeneration();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setUserProfile(data);
        } else {
          // Try to create an anonymous user with retries
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries) {
            try {
              const randomId = Math.random().toString(36).substring(7);
              const { data: { user: anonUser }, error } = await supabase.auth.signUp({
                email: `anonymous_${randomId}_${Date.now()}@temp.com`,
                password: crypto.randomUUID(),
              });
              
              if (!error && anonUser) {
                // Wait a short moment for the trigger to complete
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const { data } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', anonUser.id)
                  .single();
                
                if (data) {
                  setUserProfile(data);
                  break;
                }
              }
              
              retryCount++;
              if (retryCount === maxRetries) {
                console.error('Failed to create anonymous user after max retries');
                toast({
                  title: "Error creating anonymous session",
                  description: "Please try refreshing the page",
                  variant: "destructive",
                });
              }
              
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
              console.error('Error in anonymous user creation:', error);
              retryCount++;
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        toast({
          title: "Error loading profile",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    };
    
    fetchProfile();
  }, [toast]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const content = await generateContent(input);
      console.log('Generated content:', content);
      
      if (content) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: content.explanation || "I couldn't generate a proper response. Please try again.",
          isUser: false,
          suggestions: [
            ...(content.followUpQuestions || []),
            ...(content.relatedTopics?.map(topic => `Tell me about ${topic.title}`) || [])
          ],
        }]);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast({
          title: "✨ Magical knowledge shared!",
          description: "I've got something exciting to share with you!",
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Oops! My magic wand had a hiccup!",
        description: "Let's try that again, shall we? 🪄",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-4xl mx-auto bg-gradient-to-b from-purple-50 to-blue-50 shadow-2xl rounded-xl overflow-hidden border-2 border-purple-100">
      <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-6">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onSuggestionClick={handleSuggestionClick}
          />
        ))}
      </ScrollArea>

      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSend={handleSend}
        onQuickActionClick={setInput}
      />
    </Card>
  );
};
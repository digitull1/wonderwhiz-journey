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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
      }
    };
    fetchProfile();
  }, []);

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
      
      if (content) {
        // Add AI response with the generated content
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: content.explanation,
          isUser: false,
          suggestions: [
            ...content.followUpQuestions,
            ...content.relatedTopics.map(topic => `Tell me about ${topic.title}`)
          ],
        }]);

        // Trigger confetti for engaging responses
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
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-gradient-to-b from-purple-50 to-blue-50 shadow-2xl rounded-xl overflow-hidden border-2 border-purple-100">
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
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { Send, Loader2, Sparkles, Brain, Image, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  suggestions?: string[];
  image?: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);

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
      const context = messages.slice(-3).map(m => m.text).join(" ");
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            userAge: userProfile?.age || 8,
            context,
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: data.response,
        isUser: false,
        suggestions: data.suggestions,
        image: data.image,
      }]);

      toast({
        title: "✨ Magic happening!",
        description: "I've got something exciting to share with you!",
      });
    } catch (error) {
      toast({
        title: "Oops! My magic wand had a hiccup!",
        description: "Let's try that again, shall we? 🪄",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-gradient-to-b from-purple-50 to-blue-50 shadow-xl rounded-xl overflow-hidden">
      <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg ${
                message.isUser
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-auto'
                  : 'bg-white text-gray-800'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              
              {message.image && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img 
                    src={message.image} 
                    alt="Generated illustration" 
                    className="w-full h-auto animate-scale-in"
                  />
                </div>
              )}

              {!message.isUser && message.suggestions && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 w-full justify-start gap-2 animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                      onClick={() => setInput(suggestion)}
                    >
                      <Sparkles className="w-3 h-3" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>

      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-purple-100">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything magical..."
            className="flex-1 bg-white/50 border-purple-200 focus:border-purple-400 rounded-xl placeholder:text-purple-300"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl px-6 transition-all duration-300 hover:shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-purple-600 hover:bg-purple-100"
            onClick={() => setInput("Can you show me a picture about this?")}
          >
            <Image className="w-4 h-4 mr-1" />
            Generate Image
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-blue-600 hover:bg-blue-100"
            onClick={() => setInput("Can you quiz me about this?")}
          >
            <Target className="w-4 h-4 mr-1" />
            Take Quiz
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-green-600 hover:bg-green-100"
            onClick={() => setInput("Tell me more interesting facts!")}
          >
            <Brain className="w-4 h-4 mr-1" />
            Fun Facts
          </Button>
        </div>
      </div>
    </Card>
  );
};
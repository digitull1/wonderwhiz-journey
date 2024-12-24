import { Message } from "./types";
import { Button } from "../ui/button";
import { Sparkles, Brain, Image as ImageIcon, Target } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatMessage = ({ message, onSuggestionClick }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${
        message.isUser ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
          message.isUser
            ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white ml-auto"
            : "bg-white text-gray-800 border-2 border-purple-100"
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed font-medium">{message.text}</p>

        {message.image && (
          <div className="mt-3 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform">
            <img
              src={message.image}
              alt="Generated illustration"
              className="w-full h-auto animate-scale-in"
            />
          </div>
        )}

        {!message.isUser && message.suggestions && (
          <div className="mt-4 space-y-2">
            {message.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-xs md:text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 w-full justify-start gap-2 animate-fade-in rounded-xl"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => onSuggestionClick(suggestion)}
              >
                <Sparkles className="w-3 h-3" />
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
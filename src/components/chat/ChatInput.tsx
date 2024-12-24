import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, Loader2, Image as ImageIcon, Target, Brain } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onQuickActionClick: (action: string) => void;
}

export const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onSend,
  onQuickActionClick,
}: ChatInputProps) => {
  return (
    <div className="p-4 bg-white/90 backdrop-blur-lg border-t border-purple-100 rounded-b-xl">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask me anything magical... ✨"
          className="flex-1 bg-white/50 border-purple-200 focus:border-purple-400 rounded-xl placeholder:text-purple-300 text-base"
          disabled={isLoading}
        />
        <Button
          onClick={onSend}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl px-6 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
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
          className="text-sm text-purple-600 hover:bg-purple-100 rounded-xl transform hover:scale-105 transition-all duration-300"
          onClick={() => onQuickActionClick("Can you show me a picture about this?")}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Magic Picture
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-blue-600 hover:bg-blue-100 rounded-xl transform hover:scale-105 transition-all duration-300"
          onClick={() => onQuickActionClick("Can you quiz me about this?")}
        >
          <Target className="w-4 h-4 mr-2" />
          Fun Quiz
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-green-600 hover:bg-green-100 rounded-xl transform hover:scale-105 transition-all duration-300"
          onClick={() => onQuickActionClick("Tell me more interesting facts!")}
        >
          <Brain className="w-4 h-4 mr-2" />
          Cool Facts
        </Button>
      </div>
    </div>
  );
};
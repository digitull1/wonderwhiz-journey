import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, ChevronRight } from "lucide-react";

interface TopicCardProps {
  title: string;
  description: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  icon: string;
  onClick: () => void;
}

export const TopicCard = ({
  title,
  description,
  points,
  difficulty,
  icon,
  onClick,
}: TopicCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] bg-gradient-to-b from-white to-purple-50/50 border-purple-100/50">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300">
            {title}
          </h3>
          <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300 animate-float">
            {icon}
          </span>
        </div>
        
        <p className="text-gray-600 leading-relaxed min-h-[3rem]">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">+{points} points</span>
          </div>
          
          <span className={`px-4 py-1 rounded-full text-sm font-medium ${
            difficulty === "Easy" 
              ? "bg-green-100 text-green-700"
              : difficulty === "Medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          } transition-colors duration-300`}>
            {difficulty}
          </span>
        </div>

        <Button 
          onClick={onClick} 
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
        >
          <span className="flex items-center justify-center gap-2">
            Explore
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </div>
    </Card>
  );
};
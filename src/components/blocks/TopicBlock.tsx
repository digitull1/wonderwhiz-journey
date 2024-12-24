import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicBlockProps {
  title: string;
  description: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ageRange: string;
  onClick: () => void;
  category: string;
}

export const TopicBlock = ({
  title,
  description,
  icon,
  difficulty,
  ageRange,
  onClick,
  category,
}: TopicBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case "space":
        return "from-purple-500 to-blue-500";
      case "nature":
        return "from-green-500 to-yellow-500";
      case "history":
        return "from-amber-500 to-orange-500";
      case "art":
        return "from-pink-500 to-red-500";
      default:
        return "from-purple-500 to-blue-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 transform cursor-pointer",
        "hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]",
        `bg-gradient-to-br ${getCategoryGradient(category)}`
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300 animate-float">
            {icon}
          </span>
        </div>
        
        <p className="text-white/90 leading-relaxed min-h-[3rem]">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            getDifficultyColor(difficulty)
          )}>
            {difficulty}
          </div>
          
          <span className="text-sm text-white/90">
            Ages {ageRange}
          </span>
        </div>

        <Button 
          className={cn(
            "w-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300",
            "flex items-center justify-center gap-2 group"
          )}
        >
          Explore
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};
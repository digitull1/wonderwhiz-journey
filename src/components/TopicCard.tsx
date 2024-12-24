import { Card } from "./ui/card";
import { Button } from "./ui/button";

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-wonder-text">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-gray-600">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-wonder-primary">+{points} points ✨</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            difficulty === "Easy" 
              ? "bg-green-100 text-green-800"
              : difficulty === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
            {difficulty}
          </span>
        </div>
        <Button onClick={onClick} className="w-full bg-gradient-wonder text-white">
          Explore
        </Button>
      </div>
    </Card>
  );
};
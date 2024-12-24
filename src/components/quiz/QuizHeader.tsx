import { Star, Target } from "lucide-react";

interface QuizHeaderProps {
  score: number;
}

export const QuizHeader = ({ score }: QuizHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Target className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Quiz Time!
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400" />
        <span className="text-lg font-semibold text-purple-600">
          Score: {score}
        </span>
      </div>
    </div>
  );
};
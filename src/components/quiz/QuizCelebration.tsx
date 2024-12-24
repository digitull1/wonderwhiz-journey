import { Trophy } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface QuizCelebrationProps {
  score: number;
  totalQuestions: number;
  onClose: () => void;
}

export const QuizCelebration = ({
  score,
  totalQuestions,
  onClose,
}: QuizCelebrationProps) => {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white p-8 space-y-6 text-center animate-scale-in">
        <Trophy className="w-16 h-16 mx-auto text-yellow-400 animate-bounce" />
        <h2 className="text-2xl font-bold text-purple-600">
          Amazing Job! 🎉
        </h2>
        <p className="text-gray-600">
          You scored {score} out of {totalQuestions} points!
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            Continue Learning
          </Button>
        </div>
      </Card>
    </div>
  );
};
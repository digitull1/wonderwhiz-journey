import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Quiz } from "./Quiz";

interface TopicDeepDiveProps {
  title: string;
  description: string;
  icon: string;
  onClose: () => void;
}

export const TopicDeepDive = ({
  title,
  description,
  icon,
  onClose,
}: TopicDeepDiveProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartQuiz = () => {
    setIsLoading(true);
    toast({
      title: "Getting your quiz ready!",
      description: "Preparing some magical questions for you ✨",
    });
    // Simulate loading for demo
    setTimeout(() => {
      setIsLoading(false);
      setShowQuiz(true);
    }, 1500);
  };

  const handleQuizComplete = (score: number) => {
    toast({
      title: "Quiz Complete! 🎉",
      description: `You scored ${score} points! Great job!`,
    });
    onClose();
  };

  if (showQuiz) {
    return (
      <Quiz
        topic={title}
        onComplete={handleQuizComplete}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl bg-white p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <div className="flex items-center gap-4">
          <span className="text-4xl">{icon}</span>
          <h2 className="text-2xl font-bold text-wonder-text">{title}</h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">{description}</p>
          
          <div className="bg-wonder-background/50 p-4 rounded-lg">
            <h3 className="flex items-center gap-2 font-semibold text-wonder-text mb-2">
              <Star className="h-5 w-5 text-wonder-primary" />
              Fun Fact!
            </h3>
            <p className="text-gray-600">
              Did you know? Scientists estimate there are over 100 billion stars in our Milky Way galaxy alone!
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleStartQuiz}
            className="bg-gradient-wonder text-white"
            disabled={isLoading}
          >
            {isLoading ? "Preparing..." : "Start Quiz!"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
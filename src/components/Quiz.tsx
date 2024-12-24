import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { CheckCircle, XCircle, Target, Star, Trophy } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  topic: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

const sampleQuestions: Record<string, Question[]> = {
  "Why do rainbows appear after rain?": [
    {
      id: 1,
      question: "What causes a rainbow to form?",
      options: [
        "Sunlight reflecting off clouds",
        "Sunlight passing through water droplets",
        "Moon reflecting off water",
        "Wind patterns in the sky"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Which shape is a complete rainbow actually?",
      options: ["Half circle", "Full circle", "Straight line", "Triangle"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What happens to white light when it enters a water droplet?",
      options: [
        "It stays white",
        "It turns blue",
        "It splits into different colors",
        "It disappears"
      ],
      correctAnswer: 2
    }
  ],
  "Why do stars twinkle at night?": [
    {
      id: 1,
      question: "What makes stars appear to twinkle?",
      options: [
        "Earth's atmosphere",
        "Stars blinking",
        "Clouds passing by",
        "Moon's reflection"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Do stars twinkle when viewed from space?",
      options: ["Yes", "No", "Sometimes", "Only at night"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What is the scientific term for star twinkling?",
      options: ["Reflection", "Scintillation", "Illumination", "Radiation"],
      correctAnswer: 1
    }
  ],
  "How do butterflies transform?": [
    {
      id: 1,
      question: "What is the first stage of a butterfly's life cycle?",
      options: ["Caterpillar", "Egg", "Chrysalis", "Adult butterfly"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "What is the name of the transformation process?",
      options: ["Evolution", "Metamorphosis", "Growth", "Development"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What does a caterpillar do inside its chrysalis?",
      options: [
        "Sleeps",
        "Eats leaves",
        "Completely changes its body",
        "Grows wings"
      ],
      correctAnswer: 2
    }
  ]
};

export const Quiz = ({ topic, onComplete, onClose }: QuizProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const questions = sampleQuestions[topic] || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
      toast({
        title: "✨ Brilliant!",
        description: "You're doing amazing! Keep that curiosity flowing!",
      });
    } else {
      toast({
        title: "Almost there! 🌟",
        description: "Every question is a chance to learn something new!",
        variant: "destructive",
      });
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowCelebration(true);
        setTimeout(() => {
          onComplete(score + (answerIndex === currentQuestion.correctAnswer ? 1 : 0));
        }, 2000);
      }
    }, 1500);
  };

  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md bg-white p-8 space-y-6 text-center animate-scale-in">
          <Trophy className="w-16 h-16 mx-auto text-yellow-400 animate-bounce" />
          <h2 className="text-2xl font-bold text-purple-600">
            Amazing Job! 🎉
          </h2>
          <p className="text-gray-600">
            You scored {score} out of {questions.length} points!
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
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-gradient-to-b from-purple-50 to-blue-50 p-6 space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-semibold text-purple-600">
              Score: {score}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-xl text-gray-800 font-medium">{currentQuestion.question}</p>
          
          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full justify-start text-left h-auto py-4 px-6 rounded-xl text-lg transition-all duration-300 ${
                  isAnswered
                    ? index === currentQuestion.correctAnswer
                      ? "bg-green-100 hover:bg-green-100 text-green-800 border-2 border-green-300"
                      : index === selectedAnswer
                      ? "bg-red-100 hover:bg-red-100 text-red-800 border-2 border-red-300"
                      : "bg-gray-100 hover:bg-gray-100 text-gray-800"
                    : "bg-white hover:bg-purple-50 hover:shadow-md"
                }`}
              >
                <span className="flex items-center gap-3">
                  {isAnswered && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="text-green-600 h-6 w-6 animate-scale-in" />
                  )}
                  {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                    <XCircle className="text-red-600 h-6 w-6 animate-scale-in" />
                  )}
                  {option}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            Exit Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
};

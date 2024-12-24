import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
  correctAnswer: number;
  onAnswerSelect: (index: number) => void;
}

export const QuizQuestion = ({
  question,
  options,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  isAnswered,
  correctAnswer,
  onAnswerSelect,
}: QuizQuestionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </h2>
      </div>

      <p className="text-xl text-gray-800 font-medium">{question}</p>
      
      <div className="grid gap-3">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswerSelect(index)}
            disabled={isAnswered}
            className={`w-full justify-start text-left h-auto py-4 px-6 rounded-xl text-lg transition-all duration-300 ${
              isAnswered
                ? index === correctAnswer
                  ? "bg-green-100 hover:bg-green-100 text-green-800 border-2 border-green-300"
                  : index === selectedAnswer
                  ? "bg-red-100 hover:bg-red-100 text-red-800 border-2 border-red-300"
                  : "bg-gray-100 hover:bg-gray-100 text-gray-800"
                : "bg-white hover:bg-purple-50 hover:shadow-md"
            }`}
          >
            <span className="flex items-center gap-3">
              {isAnswered && index === correctAnswer && (
                <CheckCircle className="text-green-600 h-6 w-6 animate-scale-in" />
              )}
              {isAnswered && index === selectedAnswer && index !== correctAnswer && (
                <XCircle className="text-red-600 h-6 w-6 animate-scale-in" />
              )}
              {option}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
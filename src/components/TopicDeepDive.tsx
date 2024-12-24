import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Quiz } from "./Quiz";
import { TopicImage } from "./topic/TopicImage";
import { RelatedTopics } from "./topic/RelatedTopics";
import { useContentGeneration } from "@/hooks/use-content-generation";

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
  const [showRelatedTopics, setShowRelatedTopics] = useState(false);
  const { generateContent } = useContentGeneration();
  const [content, setContent] = useState<{
    explanation: string;
    facts: string[];
    followUpQuestions: string[];
  } | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      const generatedContent = await generateContent(title);
      if (generatedContent) {
        setContent(generatedContent);
      }
    };
    loadContent();
  }, [title]);

  const handleStartQuiz = () => {
    setIsLoading(true);
    toast({
      title: "Getting your quiz ready!",
      description: "Preparing some magical questions for you ✨",
    });
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
    setShowRelatedTopics(true);
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
      <Card className="w-full max-w-2xl bg-white p-6 space-y-6 relative animate-scale-in">
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
          <p className="text-gray-600 leading-relaxed">
            {content?.explanation || description}
          </p>
          
          <TopicImage title={title} />

          {content?.facts && (
            <div className="bg-wonder-background/50 p-4 rounded-lg animate-fade-in">
              <h3 className="flex items-center gap-2 font-semibold text-wonder-text mb-2">
                <Star className="h-5 w-5 text-wonder-primary" />
                Fun Facts!
              </h3>
              <ul className="space-y-2">
                {content.facts.map((fact, index) => (
                  <li key={index} className="text-gray-600">
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content?.followUpQuestions && showRelatedTopics && (
            <div className="space-y-2 animate-fade-in">
              <h3 className="text-lg font-semibold text-wonder-text">
                Curious to know more? 🤔
              </h3>
              {content.followUpQuestions.map((question, index) => (
                <p key={index} className="text-gray-600">
                  {question}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="animate-fade-in"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleStartQuiz}
            className="bg-gradient-wonder text-white animate-fade-in"
            disabled={isLoading}
          >
            {isLoading ? "Preparing..." : "Start Quiz!"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
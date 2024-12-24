import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Star, ArrowRight } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Quiz } from "./Quiz";

interface TopicDeepDiveProps {
  title: string;
  description: string;
  icon: string;
  onClose: () => void;
}

interface RelatedTopic {
  title: string;
  description: string;
  icon: string;
}

const getRelatedTopics = (topic: string): RelatedTopic[] => {
  const topicMap: Record<string, RelatedTopic[]> = {
    "Why do stars twinkle at night?": [
      {
        title: "What are constellations?",
        description: "Discover the stories written in the stars!",
        icon: "✨"
      },
      {
        title: "How are stars born?",
        description: "The amazing journey of stellar formation",
        icon: "🌟"
      },
      {
        title: "What is the Milky Way?",
        description: "Our cosmic neighborhood",
        icon: "🌌"
      }
    ],
    "Why do rainbows appear after rain?": [
      {
        title: "How do clouds form?",
        description: "The science behind nature's cotton candy",
        icon: "☁️"
      },
      {
        title: "What causes lightning?",
        description: "Nature's spectacular light show",
        icon: "⚡"
      },
      {
        title: "Why is the sky blue?",
        description: "The colorful mystery above us",
        icon: "🌤️"
      }
    ],
    "How do butterflies transform?": [
      {
        title: "Why do caterpillars eat so much?",
        description: "The hungry stage of metamorphosis",
        icon: "🐛"
      },
      {
        title: "What is metamorphosis?",
        description: "Nature's amazing transformations",
        icon: "🦋"
      },
      {
        title: "How do insects grow?",
        description: "The fascinating life cycles of bugs",
        icon: "🐞"
      }
    ]
  };

  return topicMap[topic] || [];
};

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
  const relatedTopics = getRelatedTopics(title);

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

          {showRelatedTopics && relatedTopics.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-wonder-text">Want to explore more? 🚀</h3>
              <div className="grid gap-4">
                {relatedTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      toast({
                        title: "New Adventure!",
                        description: "Let's explore this exciting topic!",
                      });
                    }}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-wonder-primary/20 hover:border-wonder-primary hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topic.icon}</span>
                      <div className="text-left">
                        <h4 className="font-medium text-wonder-text">{topic.title}</h4>
                        <p className="text-sm text-gray-600">{topic.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-wonder-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
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
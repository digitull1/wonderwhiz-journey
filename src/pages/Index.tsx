import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { TopicCard } from "@/components/TopicCard";
import { TopicDeepDive } from "@/components/TopicDeepDive";
import { Chat } from "@/components/Chat";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useContentGeneration } from "@/hooks/use-content-generation";
import { Loader2 } from "lucide-react";

interface Topic {
  title: string;
  description: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  icon: string;
}

const Index = () => {
  const [user, setUser] = useState<{ name: string; age: number } | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [points, setPoints] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const { generateTopics, isLoading } = useContentGeneration();

  useEffect(() => {
    const loadTopics = async () => {
      const generatedTopics = await generateTopics();
      if (generatedTopics.length > 0) {
        setTopics(generatedTopics);
      }
    };
    loadTopics();
  }, []);

  const handleWelcomeComplete = (name: string, age: number) => {
    setUser({ name, age });
    toast.success("Welcome to WonderWhiz! 🌟", {
      description: "Let's start our magical learning journey!",
    });
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleTopicClose = () => {
    setSelectedTopic(null);
  };

  if (!user) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonder-background to-white">
      <div className="container py-8 animate-fade-in">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-wonder-text">
              Welcome back, {user.name}! ✨
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-wonder-primary font-semibold text-lg">
                Points: {points}
              </span>
              <Button
                onClick={() => setShowChat(!showChat)}
                className="bg-wonder-primary hover:bg-wonder-primary/90"
              >
                {showChat ? "Hide Chat" : "Show Chat"}
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Click on any topic that sparks your curiosity
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-wonder-primary animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <TopicCard
                  {...topic}
                  onClick={() => handleTopicClick(topic)}
                />
              </div>
            ))}
          </div>
        )}

        {showChat && (
          <div className="mt-8 animate-fade-in">
            <Chat />
          </div>
        )}
      </div>

      {selectedTopic && (
        <TopicDeepDive
          title={selectedTopic.title}
          description={selectedTopic.description}
          icon={selectedTopic.icon}
          onClose={handleTopicClose}
        />
      )}
    </div>
  );
};

export default Index;
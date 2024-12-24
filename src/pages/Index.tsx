import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { TopicBlock } from "@/components/blocks/TopicBlock";
import { TopicModal } from "@/components/blocks/TopicModal";
import { Chat } from "@/components/Chat";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useContentGeneration } from "@/hooks/use-content-generation";
import { Loader2, Sparkles } from "lucide-react";

interface Topic {
  title: string;
  description: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ageRange: string;
  category: string;
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

  const handleExploreMore = () => {
    toast.info("Loading more magical topics for you! ✨");
  };

  if (!user) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Welcome back, {user.name}! ✨
              </h1>
              <p className="text-gray-600 text-lg">
                Click on any topic that sparks your curiosity
              </p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-purple-700">
                  {points} points
                </span>
              </div>
              <Button
                onClick={() => setShowChat(!showChat)}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                {showChat ? "Hide Chat" : "Show Chat"}
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="space-y-4 text-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
              <p className="text-purple-600 animate-pulse">
                Preparing magical topics...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <TopicBlock {...topic} onClick={() => handleTopicClick(topic)} />
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
        <TopicModal
          isOpen={true}
          onClose={handleTopicClose}
          topic={selectedTopic}
          onExploreMore={handleExploreMore}
        />
      )}
    </div>
  );
};

export default Index;
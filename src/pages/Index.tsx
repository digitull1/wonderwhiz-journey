import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { Chat } from "@/components/Chat";
import { toast } from "sonner";
import { useContentGeneration } from "@/hooks/use-content-generation";
import { Loader2 } from "lucide-react";

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
  const [points, setPoints] = useState(0);
  const { generateTopics, isLoading } = useContentGeneration();

  const handleWelcomeComplete = (name: string, age: number) => {
    setUser({ name, age });
    toast.success("Welcome to WonderWhiz! 🌟", {
      description: "Let's start our magical learning journey!",
    });
  };

  if (!user) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Welcome back, {user.name}! ✨
              </h1>
              <p className="text-gray-600 text-lg">
                Ask me anything that sparks your curiosity
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="font-semibold text-purple-700">
                {points} points
              </span>
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh-16rem)] animate-fade-in">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Index;
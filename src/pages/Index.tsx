import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { TopicCard } from "@/components/TopicCard";

const topics = [
  {
    id: 1,
    title: "Why do rainbows appear after rain?",
    description: "Discover the colorful magic of light and water!",
    points: 10,
    difficulty: "Easy" as const,
    icon: "🌈",
  },
  {
    id: 2,
    title: "Why do stars twinkle at night?",
    description: "Learn about the dancing lights in our night sky!",
    points: 10,
    difficulty: "Easy" as const,
    icon: "⭐",
  },
  {
    id: 3,
    title: "How do butterflies transform?",
    description: "Watch nature's most amazing transformation!",
    points: 15,
    difficulty: "Medium" as const,
    icon: "🦋",
  },
];

const Index = () => {
  const [user, setUser] = useState<{ name: string; age: number } | null>(null);

  const handleWelcomeComplete = (name: string, age: number) => {
    setUser({ name, age });
  };

  if (!user) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonder-background to-white">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wonder-text mb-2">
            Welcome back, {user.name}! ✨
          </h1>
          <p className="text-gray-600">
            Click on any topic that sparks your curiosity
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              {...topic}
              onClick={() => console.log("Clicked:", topic.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { TopicCard } from "@/components/TopicCard";
import { TopicDeepDive } from "@/components/TopicDeepDive";
import { toast } from "sonner";

const topics = [
  {
    id: 1,
    title: "Why do rainbows appear after rain?",
    description: "Discover the colorful magic of light and water!",
    points: 10,
    difficulty: "Easy" as const,
    icon: "🌈",
    fullDescription: "Rainbows appear when sunlight hits water droplets in the air at just the right angle. Each droplet acts like a tiny prism, splitting white light into all the colors we can see. That's why we often see rainbows after it rains - there are lots of water droplets in the air! The rainbow's shape is actually a full circle, but we usually only see half of it because the ground gets in the way.",
  },
  {
    id: 2,
    title: "Why do stars twinkle at night?",
    description: "Learn about the dancing lights in our night sky!",
    points: 10,
    difficulty: "Easy" as const,
    icon: "⭐",
    fullDescription: "Stars appear to twinkle because their light travels through Earth's moving atmosphere. As the air moves, it bends the starlight slightly, making the stars seem to sparkle and dance in the night sky. This is called atmospheric scintillation. Interestingly, if you were in space, the stars wouldn't appear to twinkle at all!",
  },
  {
    id: 3,
    title: "How do butterflies transform?",
    description: "Watch nature's most amazing transformation!",
    points: 15,
    difficulty: "Medium" as const,
    icon: "🦋",
    fullDescription: "Butterflies go through an amazing process called metamorphosis. It starts when a tiny egg hatches into a caterpillar. The caterpillar eats lots of leaves and grows bigger. Then, it forms a chrysalis around itself. Inside the chrysalis, the caterpillar's body completely changes, and after about two weeks, a beautiful butterfly emerges!",
  },
];

const Index = () => {
  const [user, setUser] = useState<{ name: string; age: number } | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null);
  const [points, setPoints] = useState(0);

  const handleWelcomeComplete = (name: string, age: number) => {
    setUser({ name, age });
    toast.success("Welcome to WonderWhiz! 🌟", {
      description: "Let's start our magical learning journey!",
    });
  };

  const handleTopicClick = (topic: typeof topics[0]) => {
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
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-wonder-text">
              Welcome back, {user.name}! ✨
            </h1>
            <span className="text-wonder-primary font-semibold text-lg">
              Points: {points}
            </span>
          </div>
          <p className="text-gray-600">
            Click on any topic that sparks your curiosity
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              {...topic}
              onClick={() => handleTopicClick(topic)}
            />
          ))}
        </div>
      </div>

      {selectedTopic && (
        <TopicDeepDive
          title={selectedTopic.title}
          description={selectedTopic.fullDescription}
          icon={selectedTopic.icon}
          onClose={handleTopicClose}
        />
      )}
    </div>
  );
};

export default Index;
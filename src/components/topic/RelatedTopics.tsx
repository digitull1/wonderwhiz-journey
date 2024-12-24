import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface RelatedTopic {
  title: string;
  description: string;
  icon: string;
}

interface RelatedTopicsProps {
  topics: RelatedTopic[];
}

export const RelatedTopics = ({ topics }: RelatedTopicsProps) => {
  if (!topics.length) return null;

  return (
    <div className="space-y-4 mt-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-wonder-text">Want to explore more? 🚀</h3>
      <div className="grid gap-4">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => {
              toast("New Adventure!", {
                description: "Let's explore this exciting topic!",
              });
            }}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-wonder-primary/20 hover:border-wonder-primary hover:shadow-md transition-all group animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
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
  );
};
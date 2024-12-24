import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, ChevronRight } from "lucide-react";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { useToast } from "../ui/use-toast";
import confetti from "canvas-confetti";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: {
    title: string;
    description: string;
    icon: string;
    category: string;
  };
  onExploreMore: () => void;
}

export const TopicModal = ({
  isOpen,
  onClose,
  topic,
  onExploreMore,
}: TopicModalProps) => {
  const [content, setContent] = useState<string | null>(null);
  const { generateImage, isLoading: isImageLoading } = useImageGeneration();
  const [topicImage, setTopicImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      generateTopicContent();
      generateTopicImage();
    }
  }, [isOpen, topic]);

  const generateTopicContent = async () => {
    // In a real app, this would fetch from your content generation API
    setContent(`Let's explore ${topic.title}! ${topic.description}`);
  };

  const generateTopicImage = async () => {
    const image = await generateImage(
      `Educational illustration of ${topic.title} for children, colorful, engaging, safe for work`
    );
    if (image) {
      setTopicImage(image);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleExploreMore = () => {
    toast({
      title: "Ready for more adventures?",
      description: "Let's discover related topics together! 🚀",
    });
    onExploreMore();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{topic.icon}</span>
            <h2 className="text-2xl font-bold text-wonder-text">{topic.title}</h2>
          </div>

          {content && (
            <p className="text-gray-600 leading-relaxed animate-fade-in">
              {content}
            </p>
          )}

          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            {isImageLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-wonder-primary animate-spin" />
              </div>
            ) : topicImage ? (
              <img
                src={topicImage}
                alt={topic.title}
                className="w-full h-full object-cover animate-scale-in"
              />
            ) : null}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleExploreMore}
              className="bg-gradient-wonder text-white group"
            >
              Explore More
              <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
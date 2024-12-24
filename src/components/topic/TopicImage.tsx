import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useImageGeneration } from "@/hooks/use-image-generation";

interface TopicImageProps {
  title: string;
}

export const TopicImage = ({ title }: TopicImageProps) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { generateImage, isLoading: isGeneratingImage } = useImageGeneration();

  useEffect(() => {
    const generateTopicImage = async () => {
      const prompt = `Educational illustration of ${title} for children, colorful, engaging, safe for work`;
      const image = await generateImage(prompt);
      if (image) setGeneratedImage(image);
    };
    generateTopicImage();
  }, [title]);

  if (isGeneratingImage) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg animate-fade-in">
        <Loader2 className="w-8 h-8 text-wonder-primary animate-spin" />
      </div>
    );
  }

  if (generatedImage) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 animate-scale-in">
        <img
          src={generatedImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return null;
};
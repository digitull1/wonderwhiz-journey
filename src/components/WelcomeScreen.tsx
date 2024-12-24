import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Star } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: (name: string, age: number) => void;
}

export const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(0);
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    if (name && age) {
      onComplete(name, age);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-wonder text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            Wonder Whiz <Star className="animate-float" />
          </h1>
          <p className="text-xl opacity-90">Your Magical Learning Companion</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-4">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-semibold">Hi there! 👋</h2>
              <p>I'm Wonder Whiz, your magical learning companion!</p>
              <p>What's your name?</p>
              <Input
                type="text"
                placeholder="Type your name here ✨"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
              />
              <Button
                onClick={() => name && setStep(2)}
                className="w-full bg-white/20 hover:bg-white/30"
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">Wonderful to meet you, {name}! ✨</h2>
              <p>To make our magical learning journey perfect for you, could you tell me your age?</p>
              <Input
                type="number"
                placeholder="Enter your age"
                value={age || ""}
                onChange={(e) => setAge(Number(e.target.value))}
                min={5}
                max={16}
                className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
              />
              <Button
                onClick={handleSubmit}
                className="w-full bg-white/20 hover:bg-white/30"
                disabled={!age}
              >
                Start Learning!
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
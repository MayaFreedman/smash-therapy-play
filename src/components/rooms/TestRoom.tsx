import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InteractiveObject } from "@/components/InteractiveObject";
import { spriteAnimations } from "@/config/sprite-animations";
import { useState, useRef } from "react";

interface TestRoomProps {
  onBack: () => void;
}

export const TestRoom = ({ onBack }: TestRoomProps) => {
  const [animationStates, setAnimationStates] = useState<Record<string, boolean>>({});
  const [resetKey, setResetKey] = useState(0); // Force re-render to reset animations

  const handleObjectBreak = (id: string) => {
    setAnimationStates(prev => ({ ...prev, [id]: true }));
    
    // Play breaking sound effect
    const audio = new Audio('/break-sound.mp3');
    audio.play().catch(() => {
      // Ignore audio play errors
    });
  };

  const resetRoom = () => {
    setAnimationStates({});
    setResetKey(prev => prev + 1); // Force component re-render to reset animations
  };
  return (
    <div className="min-h-screen bg-white p-6 relative">
      <Button
        variant="outline"
        size="sm"
        className="absolute top-6 left-6 z-10 bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">TEST ROOM</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Test sprite-based breaking animations
          </p>
          
          {/* Test Objects Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-8">
            <InteractiveObject
              key={`test-vase-${resetKey}`}
              id="test-vase"
              spriteConfig={spriteAnimations.vase}
              name="Test Vase"
              onBreak={() => handleObjectBreak("test-vase")}
            />
            
            <InteractiveObject
              key={`test-lamp-${resetKey}`}
              id="test-lamp"
              spriteConfig={spriteAnimations.lamp}
              name="Test Lamp"
              onBreak={() => handleObjectBreak("test-lamp")}
            />
            
            <InteractiveObject
              key={`test-chair-${resetKey}`}
              id="test-chair"
              spriteConfig={spriteAnimations.chair}
              name="Test Chair"
              onBreak={() => handleObjectBreak("test-chair")}
            />
          </div>

          {/* Reset Button */}
          {Object.keys(animationStates).length > 0 && (
            <Button 
              onClick={resetRoom}
              variant="outline"
              className="mt-4"
            >
              Reset Test Room
            </Button>
          )}
          
          {/* Fallback Media container for GIF/video files */}
          <div className="my-8 flex justify-center">
            {/* 
            Example usage:
            <img src="/path/to/your-animation.gif" alt="Animation" className="max-w-md" />
            or
            <video autoPlay loop muted className="max-w-md">
              <source src="/path/to/your-video.mp4" type="video/mp4" />
            </video>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};
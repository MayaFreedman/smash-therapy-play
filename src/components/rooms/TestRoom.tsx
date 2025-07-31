import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InteractiveObject } from "@/components/InteractiveObject";
import { DebugSlider } from "@/components/DebugSlider";
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
    <div className="min-h-screen bg-slate-100 p-6 relative">
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

          {/* Reset Button - Fixed height container to prevent layout shift */}
          <div className="mt-4 h-10 flex justify-center items-center">
            {Object.keys(animationStates).length > 0 ? (
              <Button 
                onClick={resetRoom}
                variant="outline"
              >
                Reset Test Room
              </Button>
            ) : null}
          </div>
          
          {/* Debug Slider */}
          <div className="my-8 flex justify-center">
            <DebugSlider spriteConfig={spriteAnimations.vase} />
          </div>
        </div>
      </div>
    </div>
  );
};
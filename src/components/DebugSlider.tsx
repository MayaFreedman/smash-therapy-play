import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SpriteAnimation } from "@/types/sprite-animation";
import { preloadSprites } from "@/utils/sprite-loader";

interface DebugSliderProps {
  spriteConfig: SpriteAnimation;
  onFrameChange?: (frame: number) => void;
}

export const DebugSlider = ({ spriteConfig, onFrameChange }: DebugSliderProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSprite, setCurrentSprite] = useState<string>("");

  useEffect(() => {
    const loadSprites = async () => {
      try {
        await preloadSprites(spriteConfig.spriteFolder, spriteConfig.frameCount);
        setIsLoaded(true);
        setCurrentSprite(`/assets/sprites/${spriteConfig.spriteFolder}/0.png`);
      } catch (error) {
        console.error("Failed to load sprites:", error);
      }
    };

    loadSprites();
  }, [spriteConfig]);

  useEffect(() => {
    if (isLoaded) {
      setCurrentSprite(`/assets/sprites/${spriteConfig.spriteFolder}/${currentFrame}.png`);
      onFrameChange?.(currentFrame);
    }
  }, [currentFrame, isLoaded, spriteConfig.spriteFolder, onFrameChange]);

  const handleFrameChange = (value: number[]) => {
    setCurrentFrame(value[0]);
  };

  const resetToFrame0 = () => {
    setCurrentFrame(0);
  };

  if (!isLoaded) {
    return <div className="text-sm text-muted-foreground">Loading sprites...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-card/50 rounded-lg border">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-sm font-medium text-foreground mb-2">Debug Animation</h3>
          <div className="flex items-center justify-center mb-4">
            <img
              src={currentSprite}
              alt={`Frame ${currentFrame}`}
              className="object-contain"
              style={{
                width: Math.min(spriteConfig.dimensions.width, 200),
                height: Math.min(spriteConfig.dimensions.height, 200),
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Frame: {currentFrame}</span>
            <span>Max: {spriteConfig.frameCount - 1}</span>
          </div>
          <Slider
            value={[currentFrame]}
            onValueChange={handleFrameChange}
            max={spriteConfig.frameCount - 1}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        <Button
          onClick={resetToFrame0}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Reset to Frame 0
        </Button>
      </div>
    </div>
  );
};
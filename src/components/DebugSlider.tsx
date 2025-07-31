import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { SpriteAnimation } from "@/types/sprite-animation";
import { preloadSprites } from "@/utils/sprite-loader";

interface DebugSliderProps {
  spriteConfig: SpriteAnimation;
}

export const DebugSlider = ({ spriteConfig }: DebugSliderProps) => {
  const [currentFrame, setCurrentFrame] = useState([0]);
  const [sprites, setSprites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSprites = async () => {
      try {
        const spriteFrames = await preloadSprites(spriteConfig.spriteFolder, spriteConfig.frameCount);
        setSprites(spriteFrames.map(frame => frame.src));
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load sprites:', error);
      }
    };

    loadSprites();
  }, [spriteConfig]);

  const currentSprite = sprites[currentFrame[0]] || sprites[0];
  const maxFrame = sprites.length - 1;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Debug: {spriteConfig.name}
        </h3>
        
        <div className="flex justify-center">
          {isLoaded && currentSprite ? (
            <img
              src={currentSprite}
              alt={`Frame ${currentFrame[0]}`}
              style={{
                width: spriteConfig.dimensions.width,
                height: spriteConfig.dimensions.height,
              }}
              className="object-contain"
            />
          ) : (
            <div 
              className="bg-muted animate-pulse rounded"
              style={{
                width: spriteConfig.dimensions.width,
                height: spriteConfig.dimensions.height,
              }}
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Frame: {currentFrame[0]}</span>
            <span>Max: {maxFrame}</span>
          </div>
          
          <Slider
            value={currentFrame}
            onValueChange={setCurrentFrame}
            max={maxFrame}
            min={0}
            step={1}
            className="w-full"
            disabled={!isLoaded}
          />
        </div>
      </div>
    </Card>
  );
};
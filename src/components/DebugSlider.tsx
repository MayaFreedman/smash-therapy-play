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

  // Frames to exclude from debug
  const excludedFrames = [22, 36, 38];

  useEffect(() => {
    const loadSprites = async () => {
      try {
        const spriteFrames = await preloadSprites(spriteConfig.spriteFolder, spriteConfig.frameCount);
        const allSprites = spriteFrames.map(frame => frame.src);
        
        // Filter out excluded frames
        const filteredSprites = allSprites.filter((_, index) => !excludedFrames.includes(index));
        setSprites(filteredSprites);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load sprites:', error);
      }
    };

    loadSprites();
  }, [spriteConfig]);

  // Create mapping from slider index to actual frame number
  const getActualFrameNumber = (sliderIndex: number) => {
    let actualFrame = 0;
    let validFrameCount = 0;
    
    while (validFrameCount <= sliderIndex && actualFrame <= spriteConfig.frameCount) {
      if (!excludedFrames.includes(actualFrame)) {
        if (validFrameCount === sliderIndex) break;
        validFrameCount++;
      }
      actualFrame++;
    }
    return actualFrame;
  };

  const currentSprite = sprites[currentFrame[0]] || sprites[0];
  const maxFrame = sprites.length - 1;
  const actualFrameNumber = getActualFrameNumber(currentFrame[0]);

  return (
    <Card className="p-6 bg-slate-900 border-slate-700">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">
          Debug: {spriteConfig.name}
        </h3>
        
        <div className="flex justify-center bg-white rounded-lg p-4">
          {isLoaded && currentSprite ? (
            <img
              src={currentSprite}
              alt={`Frame ${actualFrameNumber}`}
              style={{
                width: spriteConfig.dimensions.width,
                height: spriteConfig.dimensions.height,
              }}
              className="object-contain"
            />
          ) : (
            <div 
              className="bg-slate-300 animate-pulse rounded"
              style={{
                width: spriteConfig.dimensions.width,
                height: spriteConfig.dimensions.height,
              }}
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <span>Frame: {actualFrameNumber} (excluded: 22, 36, 38)</span>
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
import { useState, useEffect, useCallback, useRef } from "react";
import { SpriteAnimation, SpriteFrame } from "@/types/sprite-animation";
import { getCachedSpritesForFolder, isSpriteLoaded, getSpriteFromCache } from "@/utils/sprite-cache";

interface MultiStageAnimationState {
  isPlaying: boolean;
  currentFrame: number;
  clickCount: number;
  isLoaded: boolean;
}

export const useMultiStageAnimation = (config: SpriteAnimation) => {
  const [sprites, setSprites] = useState<SpriteFrame[]>([]);
  const [animationState, setAnimationState] = useState<MultiStageAnimationState>({
    isPlaying: false,
    currentFrame: 0,
    clickCount: 0,
    isLoaded: false
  });
  
  const animationRef = useRef<number>();

  // Get sprites from cache on mount
  useEffect(() => {
    const loadSprites = async () => {
      try {
        // Get cached sprites for this folder
        const cachedSprites = getCachedSpritesForFolder(config.spriteFolder, config.frameCount);
        
        // Convert to SpriteFrame format
        const spriteFrames: SpriteFrame[] = cachedSprites.map(sprite => ({
          src: sprite.src,
          loaded: sprite.loaded
        }));

        setSprites(spriteFrames);
        
        // Check if all sprites are loaded
        const allLoaded = cachedSprites.every(sprite => sprite.loaded);
        setAnimationState(prev => ({ ...prev, isLoaded: allLoaded }));

        // If not all loaded, try to load missing ones
        if (!allLoaded) {
          const loadMissing = async () => {
            const updatedSprites = await Promise.allSettled(
              cachedSprites.map(async (sprite) => {
                if (!sprite.loaded) {
                  try {
                    await getSpriteFromCache(sprite.src);
                    return { ...sprite, loaded: true };
                  } catch (error) {
                    console.warn(`Failed to load sprite: ${sprite.src}`, error);
                    return sprite;
                  }
                }
                return sprite;
              })
            );

            const finalSprites = updatedSprites.map((result, index) => ({
              src: cachedSprites[index].src,
              loaded: result.status === 'fulfilled' ? result.value.loaded : false
            }));

            setSprites(finalSprites);
            setAnimationState(prev => ({ ...prev, isLoaded: true }));
          };

          loadMissing();
        }
      } catch (error) {
        console.error(`Failed to load sprites for ${config.id}:`, error);
        setAnimationState(prev => ({ ...prev, isLoaded: true })); // Continue anyway
      }
    };

    loadSprites();
  }, [config.spriteFolder, config.frameCount, config.id]);

  const handleClick = useCallback(() => {
    if (animationState.isPlaying || animationState.clickCount >= config.breakStages.clicksToBreak || !animationState.isLoaded) {
      return;
    }

    const nextClickCount = animationState.clickCount + 1;
    const isLastClick = nextClickCount === config.breakStages.clicksToBreak;

    if (isLastClick) {
      // Final click - play animation from current frame to end
      const startFrame = animationState.currentFrame;
      const endFrame = config.frameCount - 1; // Last valid frame index
      
      setAnimationState(prev => ({ ...prev, isPlaying: true, clickCount: nextClickCount }));
      
      const startTime = performance.now();
      
      const animateFrame = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / config.duration, 1);
        const targetFrameIndex = startFrame + Math.floor(progress * (endFrame - startFrame));

        if (progress >= 1) {
          console.log(`Animation complete for ${config.id}, setting frame to ${endFrame}`);
          setAnimationState(prev => ({
            ...prev,
            isPlaying: false,
            currentFrame: endFrame
          }));
          return;
        }

        setAnimationState(prev => ({ ...prev, currentFrame: targetFrameIndex }));
        animationRef.current = requestAnimationFrame(animateFrame);
      };

      animationRef.current = requestAnimationFrame(animateFrame);
    } else {
      // Non-final click - jump to specific frame instantly
      const targetFrame = config.breakStages.frames[nextClickCount - 1];
      setAnimationState(prev => ({
        ...prev,
        currentFrame: targetFrame,
        clickCount: nextClickCount
      }));
    }
  }, [animationState.isPlaying, animationState.clickCount, animationState.currentFrame, animationState.isLoaded, config]);

  const resetAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setAnimationState({
      isPlaying: false,
      currentFrame: 0,
      clickCount: 0,
      isLoaded: true
    });
  }, []);

  const getCurrentSprite = useCallback(() => {
    if (!sprites.length) return null;
    // Clamp frame to valid range instead of falling back to frame 0
    const clampedFrame = Math.min(Math.max(animationState.currentFrame, 0), sprites.length - 1);
    return sprites[clampedFrame];
  }, [sprites, animationState.currentFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    handleClick,
    resetAnimation,
    getCurrentSprite,
    animationState,
    isLoaded: animationState.isLoaded,
    canAdvance: animationState.clickCount < config.breakStages.clicksToBreak && !animationState.isPlaying,
    isFullyBroken: animationState.clickCount >= config.breakStages.clicksToBreak
  };
};
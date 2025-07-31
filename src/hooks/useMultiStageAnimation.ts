import { useState, useEffect, useCallback, useRef } from "react";
import { SpriteAnimation, SpriteFrame } from "@/types/sprite-animation";
import { preloadSprites } from "@/utils/sprite-loader";

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

  // Preload sprites on mount
  useEffect(() => {
    const loadSprites = async () => {
      try {
        const loadedSprites = await preloadSprites(config.spriteFolder, config.frameCount);
        setSprites(loadedSprites);
        setAnimationState(prev => ({ ...prev, isLoaded: true }));
      } catch (error) {
        console.error(`Failed to load sprites for ${config.id}:`, error);
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
      const endFrame = config.frameCount - 1; // frameCount is total frames, so -1 for index
      
      setAnimationState(prev => ({ ...prev, isPlaying: true, clickCount: nextClickCount }));
      
      const startTime = performance.now();
      
      const animateFrame = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / config.duration, 1);
        const targetFrameIndex = startFrame + Math.floor(progress * (endFrame - startFrame));

        if (progress >= 1) {
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
    return sprites[animationState.currentFrame] || sprites[0];
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
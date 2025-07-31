import { useState, useEffect, useCallback, useRef } from "react";
import { SpriteAnimation, SpriteAnimationState, SpriteFrame } from "@/types/sprite-animation";
import { preloadSprites } from "@/utils/sprite-loader";

export const useSpriteAnimation = (config: SpriteAnimation) => {
  const [sprites, setSprites] = useState<SpriteFrame[]>([]);
  const [animationState, setAnimationState] = useState<SpriteAnimationState>({
    isPlaying: false,
    currentFrame: 0,
    isComplete: false,
    isLoaded: false
  });
  
  const animationRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();

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

  const playAnimation = useCallback(() => {
    if (animationState.isPlaying || animationState.isComplete || !animationState.isLoaded) {
      return;
    }

    setAnimationState(prev => ({ ...prev, isPlaying: true, currentFrame: 1 }));
    
    const frameInterval = config.duration / config.frameCount;
    let frameIndex = 1;

    const animateFrame = () => {
      if (frameIndex > config.frameCount) {
        setAnimationState(prev => ({
          ...prev,
          isPlaying: false,
          isComplete: true,
          currentFrame: config.frameCount
        }));
        return;
      }

      setAnimationState(prev => ({ ...prev, currentFrame: frameIndex }));
      frameIndex++;
      
      timeoutRef.current = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animateFrame);
      }, frameInterval);
    };

    animationRef.current = requestAnimationFrame(animateFrame);
  }, [animationState.isPlaying, animationState.isComplete, animationState.isLoaded, config.duration, config.frameCount]);

  const resetAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setAnimationState({
      isPlaying: false,
      currentFrame: 0,
      isComplete: false,
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    playAnimation,
    resetAnimation,
    getCurrentSprite,
    animationState,
    isLoaded: animationState.isLoaded
  };
};
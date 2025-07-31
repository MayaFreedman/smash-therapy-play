import { useState, useEffect, useCallback, useRef } from "react";
import { SpriteAnimation, SpriteFrame } from "@/types/sprite-animation";
import { preloadSprites } from "@/utils/sprite-loader";

interface MultiStageAnimationState {
  isPlaying: boolean;
  currentFrame: number;
  stage: number; // 0 = intact, 1 = first crack, 2 = second crack, 3 = fully broken
  isLoaded: boolean;
}

export const useMultiStageAnimation = (config: SpriteAnimation) => {
  const [sprites, setSprites] = useState<SpriteFrame[]>([]);
  const [animationState, setAnimationState] = useState<MultiStageAnimationState>({
    isPlaying: false,
    currentFrame: 0,
    stage: 0,
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

  const playNextStage = useCallback(() => {
    if (animationState.isPlaying || animationState.stage >= 3 || !animationState.isLoaded) {
      return;
    }

    const nextStage = animationState.stage + 1;
    let startFrame: number;
    let endFrame: number;
    
    // Define frame ranges for each stage
    switch (nextStage) {
      case 1: // First crack: frames 1-5
        startFrame = 1;
        endFrame = 5;
        break;
      case 2: // Second crack: frames 6-10
        startFrame = 6;
        endFrame = 10;
        break;
      case 3: // Final break: frames 11-40
        startFrame = 11;
        endFrame = config.frameCount;
        break;
      default:
        return;
    }

    setAnimationState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      stage: nextStage,
      currentFrame: startFrame 
    }));
    
    const frameCount = endFrame - startFrame + 1;
    const frameInterval = config.duration / frameCount;
    let frameIndex = startFrame;

    const animateFrame = () => {
      if (frameIndex > endFrame) {
        setAnimationState(prev => ({
          ...prev,
          isPlaying: false,
          currentFrame: endFrame
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
  }, [animationState.isPlaying, animationState.stage, animationState.isLoaded, config.duration, config.frameCount]);

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
      stage: 0,
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
    playNextStage,
    resetAnimation,
    getCurrentSprite,
    animationState,
    isLoaded: animationState.isLoaded,
    canAdvance: animationState.stage < 3 && !animationState.isPlaying,
    isFullyBroken: animationState.stage >= 3
  };
};
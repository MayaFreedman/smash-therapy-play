import { useState } from "react";
import { cn } from "@/lib/utils";
import { SpriteAnimation } from "@/types/sprite-animation";
import { useMultiStageAnimation } from "@/hooks/useMultiStageAnimation";

interface InteractiveObjectProps {
  id: string;
  spriteConfig?: SpriteAnimation;
  // Fallback to emoji system if no sprite config
  emoji?: string;
  name: string;
  // Legacy crack system for backwards compatibility
  crackLevel?: number;
  onBreak: () => void;
  onFirstCrunch?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const InteractiveObject = ({
  id,
  spriteConfig,
  emoji,
  name,
  crackLevel = 0,
  onBreak,
  onFirstCrunch,
  className,
  style
}: InteractiveObjectProps) => {
  const [isBreaking, setIsBreaking] = useState(false);
  
  // Use multi-stage animation for all sprite-based objects
  const multiStageAnimation = spriteConfig ? useMultiStageAnimation(spriteConfig) : null;
  
  // Determine state based on animation type
  const isBroken = multiStageAnimation?.isFullyBroken || crackLevel >= 3;
  const isCracked = !spriteConfig && (crackLevel > 0 && crackLevel < 3);
  const isPlaying = multiStageAnimation?.animationState.isPlaying || isBreaking;

  const handleClick = () => {
    if (isBroken || isPlaying) return;
    
    if (multiStageAnimation?.canAdvance) {
      // Multi-stage animation for all sprite objects
      const wasFirstClick = multiStageAnimation.animationState.clickCount === 0;
      const willBeLastClick = multiStageAnimation.animationState.clickCount + 1 >= spriteConfig.breakStages.clicksToBreak;
      
      multiStageAnimation.handleClick();
      
      if (wasFirstClick && onFirstCrunch) {
        onFirstCrunch();
      } 
      
      if (willBeLastClick) {
        onBreak();
      }
    } else if (!spriteConfig) {
      // Fallback to legacy system
      setIsBreaking(true);
      onBreak();
      
      setTimeout(() => {
        setIsBreaking(false);
      }, 600);
    }
  };

  return (
    <div 
      className={cn("flex flex-col items-center group", className)}
      style={style}
    >
      <div
        onClick={handleClick}
        className={cn(
          "relative cursor-pointer transition-all duration-300 flex items-center justify-center",
          !isBroken && !isBreaking && "hover:scale-105",
          isBroken && "cursor-not-allowed"
        )}
        style={{
          width: spriteConfig?.dimensions.width || 96,
          height: spriteConfig?.dimensions.height || 96
        }}
      >
        {spriteConfig && multiStageAnimation?.isLoaded ? (
          // Sprite-based rendering
          <img
            src={
              multiStageAnimation?.getCurrentSprite()?.src || `/assets/sprites/${spriteConfig.spriteFolder}/0.png`
            }
            alt={name}
            className="transition-all duration-300 object-contain"
            style={{
              width: spriteConfig.dimensions.width,
              height: spriteConfig.dimensions.height,
              maxWidth: spriteConfig.dimensions.width,
              maxHeight: spriteConfig.dimensions.height,
              minWidth: spriteConfig.dimensions.width,
              minHeight: spriteConfig.dimensions.height
            }}
          />
        ) : spriteConfig && !multiStageAnimation?.isLoaded ? (
          // Loading spinner for sprite objects
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        ) : emoji ? (
          // Fallback emoji rendering (only if emoji is provided)
          <span 
            className={cn(
              "text-4xl transition-all duration-300",
              isBreaking && "animate-break-apart",
              !isBroken && !isBreaking && "group-hover:scale-110",
              isCracked && "opacity-80"
            )}
          >
            {isBroken ? "💥" : emoji}
          </span>
        ) : null}
        
        {/* Crack overlay effects */}
        {isCracked && (
          <>
            {crackLevel >= 1 && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-2 left-3 w-8 h-0.5 bg-muted-foreground/40 transform rotate-45 origin-left" />
                <div className="absolute bottom-3 right-2 w-6 h-0.5 bg-muted-foreground/30 transform -rotate-12 origin-right" />
              </div>
            )}
            {crackLevel >= 2 && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1 w-10 h-0.5 bg-muted-foreground/50 transform -rotate-45 origin-left" />
                <div className="absolute top-4 right-4 w-4 h-0.5 bg-muted-foreground/40 transform rotate-12 origin-right" />
                <div className="absolute bottom-2 left-1/2 w-5 h-0.5 bg-muted-foreground/35 transform rotate-75 origin-center" />
              </div>
            )}
          </>
        )}
        
      </div>
      
      <p className={cn(
        "mt-3 text-sm text-center text-muted-foreground transition-all duration-300",
        !isBroken && "group-hover:text-foreground group-hover:font-medium"
      )}>
        {isBroken ? "Broken" : name}
      </p>
      
      {!isBroken && !isPlaying && (
        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-primary font-medium">Click to break</span>
        </div>
      )}
    </div>
  );
};
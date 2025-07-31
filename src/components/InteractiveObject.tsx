import { useState } from "react";
import { cn } from "@/lib/utils";
import { SpriteAnimation } from "@/types/sprite-animation";
import { useSpriteAnimation } from "@/hooks/useSpriteAnimation";
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
  className,
  style
}: InteractiveObjectProps) => {
  const [isBreaking, setIsBreaking] = useState(false);
  
  // Use multi-stage animation for vase, regular animation for others
  const isVase = spriteConfig?.id === "vase";
  const spriteAnimation = spriteConfig && !isVase ? useSpriteAnimation(spriteConfig) : null;
  const multiStageAnimation = spriteConfig && isVase ? useMultiStageAnimation(spriteConfig) : null;
  
  // Determine state based on animation type
  const isBroken = isVase 
    ? multiStageAnimation?.isFullyBroken 
    : spriteAnimation 
      ? spriteAnimation.animationState.isComplete 
      : crackLevel >= 3;
  
  const isCracked = spriteAnimation ? false : (crackLevel > 0 && crackLevel < 3);
  const isPlaying = isVase 
    ? multiStageAnimation?.animationState.isPlaying 
    : spriteAnimation?.animationState.isPlaying || isBreaking;

  const handleClick = () => {
    if (isBroken || isPlaying) return;
    
    if (isVase && multiStageAnimation?.canAdvance) {
      // Multi-stage animation for vase
      multiStageAnimation.handleClick();
      onBreak();
    } else if (spriteAnimation && !spriteAnimation.animationState.isComplete) {
      // Regular sprite animation for other objects
      spriteAnimation.playAnimation();
      onBreak();
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
        {spriteConfig && ((isVase && multiStageAnimation?.isLoaded) || (!isVase && spriteAnimation?.isLoaded)) ? (
          // Sprite-based rendering
          <img
            src={
              isVase 
                ? multiStageAnimation?.getCurrentSprite()?.src || `/assets/sprites/${spriteConfig.spriteFolder}/0.png`
                : spriteAnimation?.getCurrentSprite()?.src || `/assets/sprites/${spriteConfig.spriteFolder}/0.png`
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
        ) : (
          // Fallback emoji rendering
          <span 
            className={cn(
              "text-4xl transition-all duration-300",
              isBreaking && "animate-break-apart",
              !isBroken && !isBreaking && "group-hover:scale-110",
              isCracked && "opacity-80"
            )}
          >
            {isBroken ? "💥" : (emoji || "📦")}
          </span>
        )}
        
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
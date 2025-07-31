import { useState } from "react";
import { cn } from "@/lib/utils";
import { SpriteAnimation } from "@/types/sprite-animation";
import { useSpriteAnimation } from "@/hooks/useSpriteAnimation";

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
  
  // Use sprite animation if config is provided
  const spriteAnimation = spriteConfig ? useSpriteAnimation(spriteConfig) : null;
  
  // Determine state - prioritize sprite animation over legacy crack system
  const isBroken = spriteAnimation ? spriteAnimation.animationState.isComplete : crackLevel >= 3;
  const isCracked = spriteAnimation ? false : (crackLevel > 0 && crackLevel < 3);
  const isPlaying = spriteAnimation?.animationState.isPlaying || isBreaking;

  const handleClick = () => {
    if (isBroken || isPlaying) return;
    
    if (spriteAnimation && !spriteAnimation.animationState.isComplete) {
      // Use sprite animation
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
          "relative w-24 h-24 cursor-pointer transition-all duration-300 flex items-center justify-center",
          !isBroken && !isBreaking && "hover:scale-105",
          isBreaking && "animate-shatter",
          isBroken && "opacity-30 cursor-not-allowed"
        )}
      >
        {spriteConfig && spriteAnimation?.isLoaded ? (
          // Sprite-based rendering
          <img
            src={spriteAnimation.getCurrentSprite()?.src || `/assets/sprites/${spriteConfig.spriteFolder}/intact.png`}
            alt={name}
            className={cn(
              "transition-all duration-300 object-contain",
              !isBroken && !isPlaying && "group-hover:scale-110",
              isBroken && "opacity-80"
            )}
            style={{
              width: spriteConfig.dimensions.width,
              height: spriteConfig.dimensions.height
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
        
        {/* Enhanced particle effects */}
        {isPlaying && (
          <>
            {/* Central explosion particles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-destructive rounded-full animate-ping opacity-80" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-destructive/60 rounded-full animate-ping" style={{animationDelay: '0.1s'}} />
            
            {/* Corner particles */}
            <div className="absolute -top-3 -left-3 w-3 h-3 bg-accent rounded-full animate-ping" style={{animationDelay: '0.05s'}} />
            <div className="absolute -top-3 -right-3 w-2 h-2 bg-primary rounded-full animate-ping" style={{animationDelay: '0.15s'}} />
            <div className="absolute -bottom-3 -left-3 w-2 h-2 bg-secondary rounded-full animate-ping" style={{animationDelay: '0.25s'}} />
            <div className="absolute -bottom-3 -right-3 w-3 h-3 bg-therapeutic-sunset rounded-full animate-ping" style={{animationDelay: '0.35s'}} />
            
            {/* Side particles */}
            <div className="absolute top-2 -left-4 w-2 h-2 bg-therapeutic-lavender rounded-full animate-ping" style={{animationDelay: '0.2s'}} />
            <div className="absolute top-2 -right-4 w-2 h-2 bg-therapeutic-mint rounded-full animate-ping" style={{animationDelay: '0.3s'}} />
            <div className="absolute -top-4 left-2 w-2 h-2 bg-therapeutic-rose rounded-full animate-ping" style={{animationDelay: '0.4s'}} />
            <div className="absolute -bottom-4 left-2 w-2 h-2 bg-therapeutic-sage rounded-full animate-ping" style={{animationDelay: '0.1s'}} />
            
            {/* Floating debris particles */}
            <div className="absolute top-0 left-0 w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.3s'}} />
            <div className="absolute top-1 right-1 w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.5s'}} />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
          </>
        )}
      </div>
      
      <p className={cn(
        "mt-3 text-sm text-center text-muted-foreground transition-all duration-300",
        !isBroken && "group-hover:text-foreground group-hover:font-medium",
        isBroken && "opacity-50"
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
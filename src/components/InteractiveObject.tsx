import { useState } from "react";
import { cn } from "@/lib/utils";

interface InteractiveObjectProps {
  id: string;
  emoji: string;
  name: string;
  crackLevel: number; // 0 = intact, 1-2 = cracked, 3 = broken
  onCrack: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const InteractiveObject = ({
  id,
  emoji,
  name,
  crackLevel,
  onCrack,
  className,
  style
}: InteractiveObjectProps) => {
  const [isBreaking, setIsBreaking] = useState(false);
  
  const isBroken = crackLevel >= 3;
  const isCracked = crackLevel > 0 && crackLevel < 3;

  const handleClick = () => {
    if (isBroken || isBreaking) return;
    
    setIsBreaking(true);
    onCrack();
    
    // Reset breaking state after animation
    setTimeout(() => {
      setIsBreaking(false);
    }, 600);
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
        {isBreaking && (
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
      
      {!isBroken && !isBreaking && (
        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-primary font-medium">Click to break</span>
        </div>
      )}
    </div>
  );
};
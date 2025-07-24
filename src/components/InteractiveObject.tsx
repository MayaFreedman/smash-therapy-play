import { useState } from "react";
import { cn } from "@/lib/utils";

interface InteractiveObjectProps {
  id: string;
  emoji: string;
  name: string;
  isBroken: boolean;
  onBreak: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const InteractiveObject = ({
  id,
  emoji,
  name,
  isBroken,
  onBreak,
  className,
  style
}: InteractiveObjectProps) => {
  const [isBreaking, setIsBreaking] = useState(false);

  const handleClick = () => {
    if (isBroken || isBreaking) return;
    
    setIsBreaking(true);
    onBreak();
    
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
          "relative w-24 h-24 bg-gradient-object rounded-2xl shadow-object cursor-pointer transition-all duration-300 flex items-center justify-center border-2 border-border/30",
          !isBroken && !isBreaking && "hover:shadow-glow hover:scale-105 hover:border-primary/40",
          isBreaking && "animate-shatter",
          isBroken && "opacity-30 cursor-not-allowed",
          "group-hover:bg-gradient-to-br group-hover:from-primary/10 group-hover:to-accent/10"
        )}
      >
        <span 
          className={cn(
            "text-4xl transition-all duration-300",
            isBreaking && "animate-break-apart",
            !isBroken && !isBreaking && "group-hover:scale-110"
          )}
        >
          {isBroken ? "💥" : emoji}
        </span>
        
        {/* Particle effects */}
        {isBreaking && (
          <>
            <div className="absolute -top-2 -left-2 w-3 h-3 bg-destructive rounded-full animate-ping" />
            <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-accent rounded-full animate-ping" style={{animationDelay: '0.1s'}} />
            <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-ping" style={{animationDelay: '0.2s'}} />
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
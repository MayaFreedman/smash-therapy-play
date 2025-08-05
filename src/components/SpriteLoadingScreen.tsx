import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface SpriteLoadingScreenProps {
  progress: number;
  error?: string | null;
}

export const SpriteLoadingScreen: React.FC<SpriteLoadingScreenProps> = ({ 
  progress, 
  error 
}) => {
  const progressPercentage = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="space-y-2">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Loading Rage Room</h2>
          <p className="text-muted-foreground">
            Preparing sprites for maximum destruction...
          </p>
        </div>

        <div className="space-y-2">
          <Progress value={progressPercentage} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {error ? (
              <span className="text-destructive">Error: {error}</span>
            ) : (
              `${progressPercentage}% loaded`
            )}
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          Loading interactive objects and animations...
        </div>
      </div>
    </div>
  );
};
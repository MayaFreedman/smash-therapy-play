import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { preloadAllSprites } from "@/utils/sprite-preloader";
import { isCacheInitialized } from "@/utils/sprite-cache";

interface SpriteLoadingScreenProps {
  onLoadingComplete: () => void;
  children: React.ReactNode;
}

interface LoadingState {
  isLoading: boolean;
  progress: number;
  currentSprite: string;
  error: string | null;
}

export const SpriteLoadingScreen = ({ onLoadingComplete, children }: SpriteLoadingScreenProps) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    currentSprite: "",
    error: null
  });

  useEffect(() => {
    // Global sprite loading is now disabled in favor of room-specific loading
    // This component now just passes through to children immediately
    setLoadingState(prev => ({ ...prev, isLoading: false }));
    onLoadingComplete();
  }, [onLoadingComplete]);

  if (!loadingState.isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-room flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo/Title */}
        <div className="animate-float-in">
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-calm bg-clip-text text-transparent">
            RAGE ROOM
          </h1>
          <p className="text-muted-foreground">
            Loading destruction arsenal...
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-4 animate-fade-in">
          <Progress 
            value={loadingState.progress} 
            className="w-full h-3 bg-secondary"
          />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Loading assets...</span>
              <span>{loadingState.progress}%</span>
            </div>
            
            {loadingState.currentSprite && (
              <p className="text-xs text-muted-foreground/80">
                {loadingState.currentSprite}
              </p>
            )}
          </div>
        </div>

        {/* Error message */}
        {loadingState.error && (
          <div className="text-destructive text-sm p-4 bg-destructive/10 rounded-md">
            {loadingState.error}
          </div>
        )}

        {/* Loading animation */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};
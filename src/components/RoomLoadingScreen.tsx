import { useState, useEffect } from "react";
import { preloadSpriteFolder } from "@/utils/sprite-cache";

interface RoomLoadingScreenProps {
  children: React.ReactNode;
  spritesToPreload: Array<{
    spriteFolder: string;
    frameCount: number;
    name: string;
  }>;
  roomName: string;
}

interface LoadingProgress {
  currentSprite: string;
  loaded: number;
  total: number;
  progress: number;
}

export const RoomLoadingScreen = ({ 
  children, 
  spritesToPreload, 
  roomName 
}: RoomLoadingScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<LoadingProgress>({
    currentSprite: '',
    loaded: 0,
    total: 0,
    progress: 0
  });

  useEffect(() => {
    const preloadRoomSprites = async () => {
      // Check if this room's sprites are already cached
      const cacheKey = `room-sprites-${roomName}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached === 'true') {
        setIsLoading(false);
        return;
      }

      // If no sprites to preload, skip loading screen
      if (spritesToPreload.length === 0) {
        setIsLoading(false);
        return;
      }

      let totalLoaded = 0;
      let totalSprites = 0;

      // Calculate total sprites
      spritesToPreload.forEach(sprite => {
        const excludedFrames = sprite.spriteFolder === 'vase' ? [22, 36, 38] : [];
        let spriteCount = sprite.frameCount + 1; // +1 for frame 0
        spriteCount -= excludedFrames.length;
        totalSprites += spriteCount;
      });

      // Load sprites for each animation
      for (const sprite of spritesToPreload) {
        await preloadSpriteFolder(
          sprite.spriteFolder,
          sprite.frameCount,
          (loaded, folderTotal) => {
            const currentProgress = {
              currentSprite: sprite.name,
              loaded: totalLoaded + loaded,
              total: totalSprites,
              progress: Math.round(((totalLoaded + loaded) / totalSprites) * 100)
            };
            setProgress(currentProgress);
          }
        );

        // Update total loaded count
        const excludedFrames = sprite.spriteFolder === 'vase' ? [22, 36, 38] : [];
        let spriteCount = sprite.frameCount + 1;
        spriteCount -= excludedFrames.length;
        totalLoaded += spriteCount;
      }

      // Mark this room's sprites as cached
      localStorage.setItem(cacheKey, 'true');
      setIsLoading(false);
    };

    preloadRoomSprites().catch(console.error);
  }, [spritesToPreload, roomName]);

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-primary rounded-full animate-scale-in" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground">
            Loading {roomName}
          </h2>
          
          {progress.currentSprite && (
            <p className="text-muted-foreground">
              Loading {progress.currentSprite}...
            </p>
          )}
        </div>

        <div className="w-64 mx-auto space-y-2">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{progress.loaded} / {progress.total}</span>
            <span>{progress.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
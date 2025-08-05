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
        return; // Already cached, no need to preload
      }

      // If no sprites to preload, skip
      if (spritesToPreload.length === 0) {
        return;
      }

      // Preload sprites in background without showing loading screen
      try {
        let totalLoaded = 0;
        let totalSprites = 0;

        // Calculate total sprites
        spritesToPreload.forEach(sprite => {
          const excludedFrames = sprite.spriteFolder === 'vase' ? [22, 36, 38] : [];
          let spriteCount = sprite.frameCount + 1; // +1 for frame 0
          spriteCount -= excludedFrames.length;
          totalSprites += spriteCount;
        });

        // Load sprites for each animation in background
        for (const sprite of spritesToPreload) {
          await preloadSpriteFolder(
            sprite.spriteFolder,
            sprite.frameCount,
            (loaded, folderTotal) => {
              // Update progress but don't show it
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
        console.log(`${roomName} sprites cached successfully`);
      } catch (error) {
        console.error(`Failed to cache sprites for ${roomName}:`, error);
      }
    };

    // Start background preloading but don't wait for it
    preloadRoomSprites();
  }, [spritesToPreload, roomName]);

  // Always render children immediately, caching happens in background
  return <>{children}</>;
};
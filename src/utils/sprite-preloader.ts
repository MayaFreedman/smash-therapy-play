import { spriteAnimations } from "@/config/sprite-animations";
import { preloadSpriteFolder, markCacheInitialized } from "@/utils/sprite-cache";

interface PreloadProgress {
  currentSprite: string;
  loaded: number;
  total: number;
  progress: number;
}

type ProgressCallback = (progress: PreloadProgress) => void;

// Preload all sprites defined in sprite-animations.ts
export const preloadAllSprites = async (onProgress?: ProgressCallback): Promise<void> => {
  const sprites = Object.values(spriteAnimations);
  let totalLoaded = 0;
  let totalSprites = 0;

  // Calculate total sprites to load
  sprites.forEach(sprite => {
    const excludedFrames = sprite.spriteFolder === 'vase' ? [22, 36, 38] : [];
    let spriteCount = sprite.frameCount + 1; // +1 for frame 0
    spriteCount -= excludedFrames.length;
    totalSprites += spriteCount;
  });

  // Load sprites for each animation
  for (const sprite of sprites) {
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
        onProgress?.(currentProgress);
      }
    );

    // Update total loaded count
    const excludedFrames = sprite.spriteFolder === 'vase' ? [22, 36, 38] : [];
    let spriteCount = sprite.frameCount + 1;
    spriteCount -= excludedFrames.length;
    totalLoaded += spriteCount;
  }

  // Mark cache as initialized
  markCacheInitialized();
};

// Check if a specific sprite folder should be preloaded
export const shouldPreloadSprite = (spriteId: string): boolean => {
  return spriteId in spriteAnimations;
};

// Get the list of all sprite folders that need preloading
export const getSpriteFoldersToPreload = (): string[] => {
  return Object.values(spriteAnimations).map(sprite => sprite.spriteFolder);
};
// Global sprite cache manager - Plain JavaScript, no React hooks
interface CachedSprite {
  image: HTMLImageElement;
  src: string;
  loaded: boolean;
}

interface SpriteCache {
  sprites: Map<string, CachedSprite>;
  loadingPromises: Map<string, Promise<HTMLImageElement>>;
  isInitialized: boolean;
}

// Global cache instance
const globalSpriteCache: SpriteCache = {
  sprites: new Map(),
  loadingPromises: new Map(),
  isInitialized: false
};

// Load a single sprite image
const loadSpriteImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Get sprite from cache or load it
export const getSpriteFromCache = async (src: string): Promise<HTMLImageElement> => {
  // Check if already cached
  const cached = globalSpriteCache.sprites.get(src);
  if (cached && cached.loaded) {
    return cached.image;
  }

  // Check if already loading
  const loadingPromise = globalSpriteCache.loadingPromises.get(src);
  if (loadingPromise) {
    return loadingPromise;
  }

  // Start loading
  const promise = loadSpriteImage(src);
  globalSpriteCache.loadingPromises.set(src, promise);

  try {
    const image = await promise;
    globalSpriteCache.sprites.set(src, {
      image,
      src,
      loaded: true
    });
    globalSpriteCache.loadingPromises.delete(src);
    return image;
  } catch (error) {
    globalSpriteCache.loadingPromises.delete(src);
    throw error;
  }
};

// Preload all sprites for a specific folder
export const preloadSpriteFolder = async (
  spriteFolder: string, 
  frameCount: number,
  onProgress?: (loaded: number, total: number) => void
): Promise<void> => {
  const excludedFrames = spriteFolder === 'vase' ? [22, 36, 38] : [];
  const spritePaths: string[] = [];

  // Add unbroken state (0.png)
  if (!excludedFrames.includes(0)) {
    spritePaths.push(`/assets/sprites/${spriteFolder}/0.png`);
  }

  // Add animation frames (1.png to frameCount.png), excluding problematic ones
  for (let i = 1; i <= frameCount; i++) {
    if (!excludedFrames.includes(i)) {
      spritePaths.push(`/assets/sprites/${spriteFolder}/${i}.png`);
    }
  }

  let loaded = 0;
  const total = spritePaths.length;

  // Load all sprites
  const loadPromises = spritePaths.map(async (src) => {
    try {
      await getSpriteFromCache(src);
      loaded++;
      onProgress?.(loaded, total);
    } catch (error) {
      console.warn(`Failed to load sprite: ${src}`, error);
      loaded++;
      onProgress?.(loaded, total);
    }
  });

  await Promise.allSettled(loadPromises);
};

// Check if sprite is cached
export const isSpriteLoaded = (src: string): boolean => {
  const cached = globalSpriteCache.sprites.get(src);
  return cached?.loaded || false;
};

// Get all sprites for a folder (returns only loaded ones)
export const getCachedSpritesForFolder = (spriteFolder: string, frameCount: number) => {
  const excludedFrames = spriteFolder === 'vase' ? [22, 36, 38] : [];
  const sprites: { src: string; loaded: boolean }[] = [];

  // Add unbroken state (0.png)
  if (!excludedFrames.includes(0)) {
    const src = `/assets/sprites/${spriteFolder}/0.png`;
    sprites.push({
      src,
      loaded: isSpriteLoaded(src)
    });
  }

  // Add animation frames
  for (let i = 1; i <= frameCount; i++) {
    if (!excludedFrames.includes(i)) {
      const src = `/assets/sprites/${spriteFolder}/${i}.png`;
      sprites.push({
        src,
        loaded: isSpriteLoaded(src)
      });
    }
  }

  return sprites;
};

// Clear cache (useful for development)
export const clearSpriteCache = () => {
  globalSpriteCache.sprites.clear();
  globalSpriteCache.loadingPromises.clear();
  globalSpriteCache.isInitialized = false;
};

// Mark cache as initialized
export const markCacheInitialized = () => {
  globalSpriteCache.isInitialized = true;
};

// Check if cache is initialized
export const isCacheInitialized = () => {
  return globalSpriteCache.isInitialized;
};
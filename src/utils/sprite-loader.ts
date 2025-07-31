import { SpriteFrame } from "@/types/sprite-animation";

export const loadSpriteFrame = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadSprites = async (
  spriteFolder: string,
  frameCount: number
): Promise<SpriteFrame[]> => {
  const sprites: SpriteFrame[] = [];
  
  // Frames to exclude for vase animations (problematic frames)
  const excludedFrames = spriteFolder === 'vase' ? [22, 36, 38] : [];
  
  // Add unbroken state (0.png)
  if (!excludedFrames.includes(0)) {
    sprites.push({
      src: `/assets/sprites/${spriteFolder}/0.png`,
      loaded: false
    });
  }
  
  // Add animation frames (1.png to frameCount.png), excluding problematic ones
  for (let i = 1; i <= frameCount; i++) {
    if (!excludedFrames.includes(i)) {
      sprites.push({
        src: `/assets/sprites/${spriteFolder}/${i}.png`,
        loaded: false
      });
    }
  }
  
  // Preload all frames
  try {
    await Promise.all(
      sprites.map(async (sprite, index) => {
        await loadSpriteFrame(sprite.src);
        sprites[index].loaded = true;
      })
    );
  } catch (error) {
    console.warn(`Failed to preload some sprites for ${spriteFolder}:`, error);
  }
  
  return sprites;
};
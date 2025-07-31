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
  
  // Add intact state
  sprites.push({
    src: `/assets/sprites/${spriteFolder}/intact.png`,
    loaded: false
  });
  
  // Add animation frames
  for (let i = 1; i <= frameCount; i++) {
    const frameNumber = i.toString().padStart(3, '0');
    sprites.push({
      src: `/assets/sprites/${spriteFolder}/frame-${frameNumber}.png`,
      loaded: false
    });
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
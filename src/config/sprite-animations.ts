import { SpriteAnimation } from "@/types/sprite-animation";

export const spriteAnimations: Record<string, SpriteAnimation> = {
  vase: {
    id: "vase",
    name: "Decorative Vase",
    frameCount: 40,
    duration: 1000,
    spriteFolder: "vase",
    dimensions: { width: 300, height: 300 },
    breakStages: {
      clicksToBreak: 3,
      frames: [1, 4] // Click 1 → frame 1, Click 2 → frame 4, Click 3 → animate from frame 4 to 40
    }
  },
  tv: {
    id: "tv",
    name: "Television",
    frameCount: 17, // Fixed: was 18, but max frame is 17.png (0-17 = 18 frames total)
    duration: 1000,
    spriteFolder: "TV",
    dimensions: { width: 300, height: 225 },
    breakStages: {
      clicksToBreak: 2,
      frames: [1] // Click 1 → frame 1, Click 2 → animate from frame 1 to 17
    }
  }
};
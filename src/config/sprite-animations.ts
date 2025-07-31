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
  lamp: {
    id: "lamp",
    name: "Table Lamp",
    frameCount: 40,
    duration: 1200,
    spriteFolder: "lamp",
    dimensions: { width: 120, height: 120 },
    breakStages: {
      clicksToBreak: 2,
      frames: [10] // Click 1 → frame 10, Click 2 → animate from frame 10 to 40
    }
  },
  chair: {
    id: "chair",
    name: "Wooden Chair",
    frameCount: 40,
    duration: 1400,
    spriteFolder: "chair",
    dimensions: { width: 120, height: 120 },
    breakStages: {
      clicksToBreak: 1,
      frames: [] // Click 1 → animate from frame 0 to 40
    }
  },
  mirror: {
    id: "mirror",
    name: "Wall Mirror",
    frameCount: 40,
    duration: 800,
    spriteFolder: "mirror",
    dimensions: { width: 120, height: 120 },
    breakStages: {
      clicksToBreak: 2,
      frames: [5] // Click 1 → frame 5, Click 2 → animate from frame 5 to 40
    }
  },
  plate: {
    id: "plate",
    name: "Ceramic Plate",
    frameCount: 40,
    duration: 600,
    spriteFolder: "plate",
    dimensions: { width: 120, height: 120 },
    breakStages: {
      clicksToBreak: 2,
      frames: [8] // Click 1 → frame 8, Click 2 → animate from frame 8 to 40
    }
  },
  window: {
    id: "window",
    name: "Glass Window",
    frameCount: 40,
    duration: 900,
    spriteFolder: "window",
    dimensions: { width: 120, height: 120 },
    breakStages: {
      clicksToBreak: 3,
      frames: [3, 7] // Click 1 → frame 3, Click 2 → frame 7, Click 3 → animate from frame 7 to 40
    }
  },
  tv: {
    id: "tv",
    name: "Television",
    frameCount: 18,
    duration: 1000,
    spriteFolder: "TV",
    dimensions: { width: 300, height: 225 },
    breakStages: {
      clicksToBreak: 2,
      frames: [1] // Click 1 → frame 1, Click 2 → animate from frame 1 to 17
    }
  }
};
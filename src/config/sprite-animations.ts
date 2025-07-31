import { SpriteAnimation } from "@/types/sprite-animation";

export const spriteAnimations: Record<string, SpriteAnimation> = {
  vase: {
    id: "vase",
    name: "Decorative Vase",
    frameCount: 40,
    duration: 1000,
    spriteFolder: "vase",
    dimensions: { width: 300, height: 300 }
  },
  lamp: {
    id: "lamp",
    name: "Table Lamp",
    frameCount: 40,
    duration: 1200,
    spriteFolder: "lamp",
    dimensions: { width: 120, height: 120 }
  },
  chair: {
    id: "chair",
    name: "Wooden Chair",
    frameCount: 40,
    duration: 1400,
    spriteFolder: "chair",
    dimensions: { width: 120, height: 120 }
  },
  mirror: {
    id: "mirror",
    name: "Wall Mirror",
    frameCount: 40,
    duration: 800,
    spriteFolder: "mirror",
    dimensions: { width: 120, height: 120 }
  },
  plate: {
    id: "plate",
    name: "Ceramic Plate",
    frameCount: 40,
    duration: 600,
    spriteFolder: "plate",
    dimensions: { width: 120, height: 120 }
  },
  window: {
    id: "window",
    name: "Glass Window",
    frameCount: 40,
    duration: 900,
    spriteFolder: "window",
    dimensions: { width: 120, height: 120 }
  }
};
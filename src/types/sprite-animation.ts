export interface SpriteAnimation {
  id: string;
  name: string;
  frameCount: number;
  duration: number; // in milliseconds
  spriteFolder: string;
  dimensions: {
    width: number;
    height: number;
  };
  breakStages: {
    clicksToBreak: number;
    frames: number[]; // Frame to jump to for each click (except final click which plays animation)
  };
}

export interface SpriteAnimationState {
  isPlaying: boolean;
  currentFrame: number;
  isComplete: boolean;
  isLoaded: boolean;
}

export interface SpriteFrame {
  src: string;
  loaded: boolean;
}
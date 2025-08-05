import { SpriteFrame } from "@/types/sprite-animation";
import { spriteAnimations } from "@/config/sprite-animations";

class SpriteCache {
  private cache: Map<string, HTMLImageElement> = new Map();
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();
  private loadedCount = 0;
  private totalCount = 0;
  private listeners: ((progress: number) => void)[] = [];

  // Calculate total sprites to load
  calculateTotalSprites(): number {
    let total = 0;
    
    Object.values(spriteAnimations).forEach(config => {
      const excludedFrames = config.spriteFolder === 'vase' ? [22, 36, 38] : [];
      
      // Add frame 0 if not excluded
      if (!excludedFrames.includes(0)) {
        total++;
      }
      
      // Add animation frames 1 to frameCount, excluding problematic ones
      for (let i = 1; i <= config.frameCount; i++) {
        if (!excludedFrames.includes(i)) {
          total++;
        }
      }
    });
    
    return total;
  }

  // Load a single sprite and cache it
  private async loadSprite(src: string): Promise<HTMLImageElement> {
    // Return cached version if available
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Create new loading promise
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        this.loadingPromises.delete(src);
        this.loadedCount++;
        this.notifyProgress();
        resolve(img);
      };
      
      img.onerror = (error) => {
        this.loadingPromises.delete(src);
        console.warn(`Failed to load sprite: ${src}`, error);
        reject(error);
      };
      
      // Set cache headers for better browser caching
      img.crossOrigin = 'anonymous';
      img.src = src;
    });

    this.loadingPromises.set(src, loadPromise);
    return loadPromise;
  }

  // Preload all sprites for all animations
  async preloadAllSprites(): Promise<void> {
    this.totalCount = this.calculateTotalSprites();
    this.loadedCount = 0;
    
    const loadPromises: Promise<HTMLImageElement>[] = [];
    
    // Load sprites for each animation config
    Object.values(spriteAnimations).forEach(config => {
      const excludedFrames = config.spriteFolder === 'vase' ? [22, 36, 38] : [];
      
      // Load frame 0 if not excluded
      if (!excludedFrames.includes(0)) {
        const src = `/assets/sprites/${config.spriteFolder}/0.png`;
        loadPromises.push(this.loadSprite(src));
      }
      
      // Load animation frames 1 to frameCount, excluding problematic ones
      for (let i = 1; i <= config.frameCount; i++) {
        if (!excludedFrames.includes(i)) {
          const src = `/assets/sprites/${config.spriteFolder}/${i}.png`;
          loadPromises.push(this.loadSprite(src));
        }
      }
    });

    // Wait for all sprites to load (or fail)
    const results = await Promise.allSettled(loadPromises);
    
    // Log any failures
    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length > 0) {
      console.warn(`Failed to load ${failures.length} sprites`);
    }
  }

  // Get sprites for a specific animation
  getSpritesForAnimation(spriteFolder: string, frameCount: number): SpriteFrame[] {
    const sprites: SpriteFrame[] = [];
    const excludedFrames = spriteFolder === 'vase' ? [22, 36, 38] : [];
    
    // Add frame 0 if not excluded
    if (!excludedFrames.includes(0)) {
      const src = `/assets/sprites/${spriteFolder}/0.png`;
      sprites.push({
        src,
        loaded: this.cache.has(src)
      });
    }
    
    // Add animation frames 1 to frameCount, excluding problematic ones
    for (let i = 1; i <= frameCount; i++) {
      if (!excludedFrames.includes(i)) {
        const src = `/assets/sprites/${spriteFolder}/${i}.png`;
        sprites.push({
          src,
          loaded: this.cache.has(src)
        });
      }
    }
    
    return sprites;
  }

  // Get cached image element
  getCachedImage(src: string): HTMLImageElement | null {
    return this.cache.get(src) || null;
  }

  // Subscribe to loading progress
  onProgress(callback: (progress: number) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify progress to all listeners
  private notifyProgress(): void {
    const progress = this.totalCount > 0 ? this.loadedCount / this.totalCount : 0;
    this.listeners.forEach(callback => callback(progress));
  }

  // Get current loading progress
  getProgress(): number {
    return this.totalCount > 0 ? this.loadedCount / this.totalCount : 0;
  }

  // Check if all sprites are loaded
  isFullyLoaded(): boolean {
    return this.loadedCount >= this.totalCount && this.totalCount > 0;
  }

  // Clear cache (for development/testing)
  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
    this.loadedCount = 0;
    this.totalCount = 0;
  }
}

// Export singleton instance
export const spriteCache = new SpriteCache();
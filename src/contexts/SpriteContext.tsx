import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { spriteCache } from '@/utils/sprite-cache';

interface SpriteContextValue {
  isLoading: boolean;
  progress: number;
  error: string | null;
  isLoaded: boolean;
}

const SpriteContext = createContext<SpriteContextValue | undefined>(undefined);

interface SpriteProviderProps {
  children: ReactNode;
}

export const SpriteProvider: React.FC<SpriteProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSprites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Subscribe to progress updates
        const unsubscribe = spriteCache.onProgress((newProgress) => {
          if (mounted) {
            setProgress(newProgress);
          }
        });

        // Start preloading
        await spriteCache.preloadAllSprites();
        
        if (mounted) {
          setIsLoaded(true);
          setIsLoading(false);
        }

        // Cleanup progress subscription
        unsubscribe();
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load sprites');
          setIsLoading(false);
        }
      }
    };

    loadSprites();

    return () => {
      mounted = false;
    };
  }, []);

  const value: SpriteContextValue = {
    isLoading,
    progress,
    error,
    isLoaded
  };

  return (
    <SpriteContext.Provider value={value}>
      {children}
    </SpriteContext.Provider>
  );
};

export const useSpriteCache = (): SpriteContextValue => {
  const context = useContext(SpriteContext);
  if (!context) {
    throw new Error('useSpriteCache must be used within a SpriteProvider');
  }
  return context;
};
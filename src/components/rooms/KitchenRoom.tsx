import { useState } from "react";
import { InteractiveObject } from "../InteractiveObject";

interface KitchenRoomProps {
  onBack: () => void;
}

export const KitchenRoom = ({ onBack }: KitchenRoomProps) => {
  const [brokenObjects, setBrokenObjects] = useState<Set<string>>(new Set());

  const handleObjectBreak = (id: string) => {
    setBrokenObjects(prev => new Set([...prev, id]));
    // Play breaking sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEfCCmKzfPVhC8HHm7C7+OZSA0PT6Xf8YJTBg9Mn+TzmGEhCSpP');
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  return (
    <div className="min-h-screen bg-kitchen-room relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-room" />
      
      {/* Kitchen ambiance */}
      <div className="absolute top-20 left-10 text-5xl opacity-50 animate-gentle-pulse">🌾</div>
      <div className="absolute bottom-10 right-20 text-4xl opacity-40 animate-gentle-pulse" style={{animationDelay: '2s'}}>🍃</div>
      
      {/* Warm lighting overlay */}
      <div className="absolute top-40 right-40 w-52 h-52 bg-accent/15 rounded-full blur-3xl animate-gentle-pulse" />
      <div className="absolute bottom-40 left-40 w-44 h-44 bg-primary/10 rounded-full blur-3xl animate-gentle-pulse" style={{animationDelay: '1.5s'}} />

      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-float-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Warm Kitchen
            </h2>
            <p className="text-muted-foreground">
              Find satisfaction in the heart of the home
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {/* Plate */}
            <InteractiveObject
              id="plate"
              emoji="🍽️"
              name="Dinner Plate"
              isBroken={brokenObjects.has("plate")}
              onBreak={() => handleObjectBreak("plate")}
              className="animate-float-in"
            />

            {/* Tea Cup */}
            <InteractiveObject
              id="teacup"
              emoji="🫖"
              name="Tea Cup"
              isBroken={brokenObjects.has("teacup")}
              onBreak={() => handleObjectBreak("teacup")}
              className="animate-float-in"
              style={{animationDelay: '0.1s'}}
            />

            {/* Glass Bowl */}
            <InteractiveObject
              id="bowl"
              emoji="🥣"
              name="Glass Bowl"
              isBroken={brokenObjects.has("bowl")}
              onBreak={() => handleObjectBreak("bowl")}
              className="animate-float-in"
              style={{animationDelay: '0.2s'}}
            />

            {/* Wine Bottle */}
            <InteractiveObject
              id="bottle"
              emoji="🍾"
              name="Wine Bottle"
              isBroken={brokenObjects.has("bottle")}
              onBreak={() => handleObjectBreak("bottle")}
              className="animate-float-in"
              style={{animationDelay: '0.3s'}}
            />

            {/* Cookie Jar */}
            <InteractiveObject
              id="jar"
              emoji="🍪"
              name="Cookie Jar"
              isBroken={brokenObjects.has("jar")}
              onBreak={() => handleObjectBreak("jar")}
              className="animate-float-in"
              style={{animationDelay: '0.4s'}}
            />

            {/* Blender */}
            <InteractiveObject
              id="blender"
              emoji="🥤"
              name="Glass Blender"
              isBroken={brokenObjects.has("blender")}
              onBreak={() => handleObjectBreak("blender")}
              className="animate-float-in"
              style={{animationDelay: '0.5s'}}
            />

            {/* Salt Shaker */}
            <InteractiveObject
              id="salt"
              emoji="🧂"
              name="Salt Shaker"
              isBroken={brokenObjects.has("salt")}
              onBreak={() => handleObjectBreak("salt")}
              className="animate-float-in"
              style={{animationDelay: '0.6s'}}
            />

            {/* Cutting Board */}
            <InteractiveObject
              id="cutting-board"
              emoji="🍕"
              name="Wooden Board"
              isBroken={brokenObjects.has("cutting-board")}
              onBreak={() => handleObjectBreak("cutting-board")}
              className="animate-float-in"
              style={{animationDelay: '0.7s'}}
            />
          </div>

          {brokenObjects.size > 0 && (
            <div className="text-center mt-12 animate-float-in">
              <p className="text-muted-foreground mb-4">
                Items broken: {brokenObjects.size}/8
              </p>
              <button
                onClick={() => setBrokenObjects(new Set())}
                className="px-6 py-2 bg-gradient-calm text-white rounded-full hover:shadow-glow transition-all duration-300"
              >
                Reset Kitchen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
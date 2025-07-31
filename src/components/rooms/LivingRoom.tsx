import { useState } from "react";
import { InteractiveObject } from "../InteractiveObject";

interface LivingRoomProps {
  onBack: () => void;
}

export const LivingRoom = ({ onBack }: LivingRoomProps) => {
  const [objectCracks, setObjectCracks] = useState<Record<string, number>>({});

  const handleObjectCrack = (id: string) => {
    setObjectCracks(prev => {
      const currentLevel = prev[id] || 0;
      const newLevel = currentLevel + 1;
      
      // Play breaking sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEfCCmKzfPVhC8HHm7C7+OZSA0PT6Xf8YJTBg9Mn+TzmGEhCSpP');
      audio.volume = 0.1;
      audio.play().catch(() => {});
      
      return { ...prev, [id]: newLevel };
    });
  };

  return (
    <div className="min-h-screen bg-living-room relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-room" />
      
      {/* Decorative plants */}
      <div className="absolute bottom-0 left-10 text-6xl opacity-60 animate-gentle-pulse">🌿</div>
      <div className="absolute bottom-0 right-20 text-4xl opacity-40 animate-gentle-pulse" style={{animationDelay: '1s'}}>🪴</div>
      
      {/* Soft lighting overlay */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-primary-glow/20 rounded-full blur-3xl animate-gentle-pulse" />
      <div className="absolute bottom-40 left-20 w-60 h-60 bg-accent/15 rounded-full blur-3xl animate-gentle-pulse" style={{animationDelay: '2s'}} />

      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-float-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Serene Bedroom
            </h2>
            <p className="text-muted-foreground">
              Click objects 3 times to experience progressive cracking and breaking
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {/* Pillow */}
            <InteractiveObject
              id="pillow"
              emoji="🛏️"
              name="Soft Pillow"
              crackLevel={objectCracks["pillow"] || 0}
              onBreak={() => handleObjectCrack("pillow")}
              className="animate-float-in"
            />

            {/* Alarm Clock */}
            <InteractiveObject
              id="alarm"
              emoji="⏰"
              name="Alarm Clock"
              crackLevel={objectCracks["alarm"] || 0}
              onBreak={() => handleObjectCrack("alarm")}
              className="animate-float-in"
              style={{animationDelay: '0.1s'}}
            />

            {/* Bedside Lamp */}
            <InteractiveObject
              id="bedlamp"
              emoji="🛋️"
              name="Bedside Lamp"
              crackLevel={objectCracks["bedlamp"] || 0}
              onBreak={() => handleObjectCrack("bedlamp")}
              className="animate-float-in"
              style={{animationDelay: '0.2s'}}
            />

            {/* Dresser Mirror */}
            <InteractiveObject
              id="dresser"
              emoji="🪞"
              name="Dresser Mirror"
              crackLevel={objectCracks["dresser"] || 0}
              onBreak={() => handleObjectCrack("dresser")}
              className="animate-float-in"
              style={{animationDelay: '0.3s'}}
            />

            {/* Jewelry Box */}
            <InteractiveObject
              id="jewelry"
              emoji="💎"
              name="Jewelry Box"
              crackLevel={objectCracks["jewelry"] || 0}
              onBreak={() => handleObjectCrack("jewelry")}
              className="animate-float-in"
              style={{animationDelay: '0.4s'}}
            />

            {/* Water Glass */}
            <InteractiveObject
              id="water"
              emoji="🥛"
              name="Water Glass"
              crackLevel={objectCracks["water"] || 0}
              onBreak={() => handleObjectCrack("water")}
              className="animate-float-in"
              style={{animationDelay: '0.5s'}}
            />

            {/* Family Photo */}
            <InteractiveObject
              id="photo"
              emoji="🖼️"
              name="Family Photo"
              crackLevel={objectCracks["photo"] || 0}
              onBreak={() => handleObjectCrack("photo")}
              className="animate-float-in"
              style={{animationDelay: '0.6s'}}
            />

            {/* Perfume Bottle */}
            <InteractiveObject
              id="perfume"
              emoji="🧴"
              name="Perfume Bottle"
              crackLevel={objectCracks["perfume"] || 0}
              onBreak={() => handleObjectCrack("perfume")}
              className="animate-float-in"
              style={{animationDelay: '0.7s'}}
            />
          </div>

          {Object.values(objectCracks).some(level => level > 0) && (
            <div className="text-center mt-12 animate-float-in">
              <p className="text-muted-foreground mb-4">
                Objects damaged: {Object.values(objectCracks).filter(level => level > 0).length}/8
              </p>
              <button
                onClick={() => setObjectCracks({})}
                className="px-6 py-2 bg-gradient-calm text-white rounded-full hover:shadow-glow transition-all duration-300"
              >
                Reset Bedroom
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
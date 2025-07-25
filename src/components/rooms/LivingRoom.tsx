import { useState } from "react";
import { InteractiveObject } from "../InteractiveObject";

interface LivingRoomProps {
  onBack: () => void;
}

export const LivingRoom = ({ onBack }: LivingRoomProps) => {
  const [brokenObjects, setBrokenObjects] = useState<Set<string>>(new Set());

  const handleObjectBreak = (id: string) => {
    setBrokenObjects(prev => new Set([...prev, id]));
    // Play breaking sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEfCCmKzfPVhC8HHm7C7+OZSA0PT6Xf8YJTBg9Mn+TzmGEhCSpP');
    audio.volume = 0.1;
    audio.play().catch(() => {});
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
              Click on objects to experience gentle, satisfying interactions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {/* Pillow */}
            <InteractiveObject
              id="pillow"
              emoji="🛏️"
              name="Fluffy Pillow"
              isBroken={brokenObjects.has("pillow")}
              onBreak={() => handleObjectBreak("pillow")}
              className="animate-float-in"
            />

            {/* Alarm Clock */}
            <InteractiveObject
              id="alarm"
              emoji="⏰"
              name="Alarm Clock"
              isBroken={brokenObjects.has("alarm")}
              onBreak={() => handleObjectBreak("alarm")}
              className="animate-float-in"
              style={{animationDelay: '0.1s'}}
            />

            {/* Bedside Lamp */}
            <InteractiveObject
              id="bedlamp"
              emoji="🛋️"
              name="Bedside Lamp"
              isBroken={brokenObjects.has("bedlamp")}
              onBreak={() => handleObjectBreak("bedlamp")}
              className="animate-float-in"
              style={{animationDelay: '0.2s'}}
            />

            {/* Mirror */}
            <InteractiveObject
              id="mirror"
              emoji="🪞"
              name="Dresser Mirror"
              isBroken={brokenObjects.has("mirror")}
              onBreak={() => handleObjectBreak("mirror")}
              className="animate-float-in"
              style={{animationDelay: '0.3s'}}
            />

            {/* Jewelry Box */}
            <InteractiveObject
              id="jewelry"
              emoji="💎"
              name="Jewelry Box"
              isBroken={brokenObjects.has("jewelry")}
              onBreak={() => handleObjectBreak("jewelry")}
              className="animate-float-in"
              style={{animationDelay: '0.4s'}}
            />

            {/* Water Glass */}
            <InteractiveObject
              id="water"
              emoji="🥤"
              name="Water Glass"
              isBroken={brokenObjects.has("water")}
              onBreak={() => handleObjectBreak("water")}
              className="animate-float-in"
              style={{animationDelay: '0.5s'}}
            />

            {/* Photo Frame */}
            <InteractiveObject
              id="photo"
              emoji="🖼️"
              name="Family Photo"
              isBroken={brokenObjects.has("photo")}
              onBreak={() => handleObjectBreak("photo")}
              className="animate-float-in"
              style={{animationDelay: '0.6s'}}
            />

            {/* Perfume Bottle */}
            <InteractiveObject
              id="perfume"
              emoji="🧴"
              name="Perfume Bottle"
              isBroken={brokenObjects.has("perfume")}
              onBreak={() => handleObjectBreak("perfume")}
              className="animate-float-in"
              style={{animationDelay: '0.7s'}}
            />
          </div>

          {brokenObjects.size > 0 && (
            <div className="text-center mt-12 animate-float-in">
              <p className="text-muted-foreground mb-4">
                Objects broken: {brokenObjects.size}/8
              </p>
              <button
                onClick={() => setBrokenObjects(new Set())}
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
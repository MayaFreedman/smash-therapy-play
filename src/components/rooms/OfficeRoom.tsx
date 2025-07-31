import { useState } from "react";
import { InteractiveObject } from "../InteractiveObject";

interface OfficeRoomProps {
  onBack: () => void;
}

export const OfficeRoom = ({ onBack }: OfficeRoomProps) => {
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
    <div className="min-h-screen bg-office-room relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-room" />
      
      {/* Office ambiance */}
      <div className="absolute top-10 left-20 text-4xl opacity-50 animate-gentle-pulse">📚</div>
      <div className="absolute bottom-20 right-10 text-3xl opacity-40 animate-gentle-pulse" style={{animationDelay: '1.5s'}}>📋</div>
      
      {/* Soft lighting overlay */}
      <div className="absolute top-32 left-32 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-gentle-pulse" />
      <div className="absolute bottom-32 right-32 w-56 h-56 bg-accent/10 rounded-full blur-3xl animate-gentle-pulse" style={{animationDelay: '1s'}} />

      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-float-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Peaceful Office
            </h2>
            <p className="text-muted-foreground">
              Click objects 3 times to experience progressive cracking and breaking
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {/* Computer Monitor */}
            <InteractiveObject
              id="monitor"
              emoji="🖥️"
              name="Computer Monitor"
              crackLevel={objectCracks["monitor"] || 0}
              onBreak={() => handleObjectCrack("monitor")}
              className="animate-float-in"
            />

            {/* Coffee Mug */}
            <InteractiveObject
              id="mug"
              emoji="☕"
              name="Coffee Mug"
              crackLevel={objectCracks["mug"] || 0}
              onBreak={() => handleObjectCrack("mug")}
              className="animate-float-in"
              style={{animationDelay: '0.1s'}}
            />

            {/* Desk Lamp */}
            <InteractiveObject
              id="desk-lamp"
              emoji="🔦"
              name="Desk Lamp"
              crackLevel={objectCracks["desk-lamp"] || 0}
              onBreak={() => handleObjectCrack("desk-lamp")}
              className="animate-float-in"
              style={{animationDelay: '0.2s'}}
            />

            {/* Smartphone */}
            <InteractiveObject
              id="phone"
              emoji="📱"
              name="Smartphone"
              crackLevel={objectCracks["phone"] || 0}
              onBreak={() => handleObjectCrack("phone")}
              className="animate-float-in"
              style={{animationDelay: '0.3s'}}
            />

            {/* Trophy */}
            <InteractiveObject
              id="trophy"
              emoji="🏆"
              name="Achievement Trophy"
              crackLevel={objectCracks["trophy"] || 0}
              onBreak={() => handleObjectCrack("trophy")}
              className="animate-float-in"
              style={{animationDelay: '0.4s'}}
            />

            {/* Calculator */}
            <InteractiveObject
              id="calculator"
              emoji="🧮"
              name="Calculator"
              crackLevel={objectCracks["calculator"] || 0}
              onBreak={() => handleObjectCrack("calculator")}
              className="animate-float-in"
              style={{animationDelay: '0.5s'}}
            />

            {/* Printer */}
            <InteractiveObject
              id="printer"
              emoji="🖨️"
              name="Office Printer"
              crackLevel={objectCracks["printer"] || 0}
              onBreak={() => handleObjectCrack("printer")}
              className="animate-float-in"
              style={{animationDelay: '0.6s'}}
            />

            {/* Stress Ball */}
            <InteractiveObject
              id="stress-ball"
              emoji="⚾"
              name="Stress Ball"
              crackLevel={objectCracks["stress-ball"] || 0}
              onBreak={() => handleObjectCrack("stress-ball")}
              className="animate-float-in"
              style={{animationDelay: '0.7s'}}
            />
          </div>

          {Object.values(objectCracks).some(level => level > 0) && (
            <div className="text-center mt-12 animate-float-in">
              <p className="text-muted-foreground mb-4">
                Stress released: {Object.values(objectCracks).filter(level => level > 0).length}/8
              </p>
              <button
                onClick={() => setObjectCracks({})}
                className="px-6 py-2 bg-gradient-calm text-white rounded-full hover:shadow-glow transition-all duration-300"
              >
                Reset Office
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
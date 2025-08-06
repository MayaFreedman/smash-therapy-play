import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2 } from "lucide-react";
import { InteractiveObject } from "@/components/InteractiveObject";
import { DebugSlider } from "@/components/DebugSlider";
import { Slider } from "@/components/ui/slider";
import { spriteAnimations } from "@/config/sprite-animations";
import { RoomLoadingScreen } from "@/components/RoomLoadingScreen";
import { useState, useRef } from "react";
import sledgehammerImg from "@/assets/weapons/sledgehammer.png";
import baseballBatImg from "@/assets/weapons/baseball-bat.png";
import crowbarImg from "@/assets/weapons/crowbar.png";

interface TestRoomProps {
  onBack: () => void;
}

type Weapon = 'sledgehammer' | 'baseball-bat' | 'crowbar' | null;

export const TestRoom = ({ onBack }: TestRoomProps) => {
  const [animationStates, setAnimationStates] = useState<Record<string, boolean>>({});
  const [resetKey, setResetKey] = useState(0); // Force re-render to reset animations
  const [volume, setVolume] = useState([0.5]); // Volume from 0 to 1
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon>(null);

  const weapons = [
    { id: 'sledgehammer' as const, name: 'Sledgehammer', image: sledgehammerImg },
    { id: 'baseball-bat' as const, name: 'Baseball Bat', image: baseballBatImg },
    { id: 'crowbar' as const, name: 'Crowbar', image: crowbarImg }
  ];

  // Define sprites that need preloading for this room
  const spritesToPreload = [
    {
      spriteFolder: spriteAnimations.vase.spriteFolder,
      frameCount: spriteAnimations.vase.frameCount,
      name: spriteAnimations.vase.name
    },
    {
      spriteFolder: spriteAnimations.tv.spriteFolder,
      frameCount: spriteAnimations.tv.frameCount,
      name: spriteAnimations.tv.name
    }
  ];

  const handleObjectBreak = (id: string) => {
    setAnimationStates(prev => ({ ...prev, [id]: true }));
    
    // Play specific sound effect based on object type
    let soundFile = '/break-sound.mp3'; // default
    
    if (id.includes('tv')) {
      soundFile = '/sounds/tv-shatter.wav';
    } else if (id.includes('vase')) {
      soundFile = '/sounds/vase-smash.wav';
    }
    
    console.log('Playing sound:', soundFile, 'for object:', id);
    const audio = new Audio(soundFile);
    audio.volume = volume[0]; // Set volume from slider
    audio.play().catch((error) => {
      console.error('Audio play failed:', error);
    });
  };

  const resetRoom = () => {
    setAnimationStates({});
    setResetKey(prev => prev + 1); // Force component re-render to reset animations
  };
  return (
    <RoomLoadingScreen
      spritesToPreload={spritesToPreload}
      roomName="Test Room"
    >
      <div className="min-h-screen bg-slate-100 p-6 relative">
        <Button
          variant="outline"
          size="sm"
          className="absolute top-6 left-6 z-10 bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-center min-h-screen">
          <div 
            className="text-center"
            style={{
              cursor: selectedWeapon 
                ? `url(${weapons.find(w => w.id === selectedWeapon)?.image}) 32 32, auto`
                : 'default'
            }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">TEST ROOM</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Test sprite-based breaking animations
            </p>
            
            {/* Weapon Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Choose Your Weapon</h3>
              <div className="flex justify-center gap-4">
                {weapons.map((weapon) => (
                  <Button
                    key={weapon.id}
                    variant={selectedWeapon === weapon.id ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-auto p-4"
                    onClick={() => setSelectedWeapon(weapon.id)}
                  >
                    <img 
                      src={weapon.image} 
                      alt={weapon.name}
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-xs">{weapon.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Test Objects Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-8">
              <InteractiveObject
                key={`test-vase-${resetKey}`}
                id="test-vase"
                spriteConfig={spriteAnimations.vase}
                name="Test Vase"
                onBreak={() => handleObjectBreak("test-vase")}
              />
              
              <InteractiveObject
                key={`test-lamp-${resetKey}`}
                id="test-lamp"
                emoji="💡"
                name="Test Lamp"
                crackLevel={0}
                onBreak={() => handleObjectBreak("test-lamp")}
              />
              
              <InteractiveObject
                key={`test-chair-${resetKey}`}
                id="test-chair"
                emoji="🪑"
                name="Test Chair"
                crackLevel={0}
                onBreak={() => handleObjectBreak("test-chair")}
              />
              
              <InteractiveObject
                key={`test-tv-${resetKey}`}
                id="test-tv"
                spriteConfig={spriteAnimations.tv}
                name="Test TV"
                onBreak={() => handleObjectBreak("test-tv")}
              />
            </div>

            {/* Reset Button - Fixed height container to prevent layout shift */}
            <div className="mt-4 h-10 flex justify-center items-center">
              {Object.keys(animationStates).length > 0 ? (
                <Button 
                  onClick={resetRoom}
                  variant="outline"
                >
                  Reset Test Room
                </Button>
              ) : null}
            </div>
            
            {/* Volume Control */}
            <div className="mb-8 flex items-center justify-center gap-4 max-w-xs mx-auto">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <span className="text-sm text-muted-foreground min-w-[3ch]">
                {Math.round(volume[0] * 100)}%
              </span>
            </div>

            {/* Debug Slider */}
            <div className="my-8 flex justify-center">
              <DebugSlider spriteConfig={spriteAnimations.tv} />
            </div>
          </div>
        </div>
      </div>
    </RoomLoadingScreen>
  );
};
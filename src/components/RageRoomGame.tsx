import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LivingRoom } from "./rooms/LivingRoom";
import { OfficeRoom } from "./rooms/OfficeRoom";
import { KitchenRoom } from "./rooms/KitchenRoom";
import { Home, ArrowLeft } from "lucide-react";

type Room = "home" | "living" | "office" | "kitchen";

export const RageRoomGame = () => {
  const [currentRoom, setCurrentRoom] = useState<Room>("home");

  const rooms = [
    {
      id: "living" as const,
      name: "Cozy Living Room",
      description: "Soft cushions and gentle lighting await",
      color: "bg-living-room",
      icon: "🛋️"
    },
    {
      id: "office" as const,
      name: "Peaceful Office",
      description: "Release work stress in tranquil surroundings",
      color: "bg-office-room",
      icon: "💼"
    },
    {
      id: "kitchen" as const,
      name: "Warm Kitchen",
      description: "Break dishes in a soothing space",
      color: "bg-kitchen-room",
      icon: "🍽️"
    }
  ];

  const renderRoom = () => {
    switch (currentRoom) {
      case "living":
        return <LivingRoom onBack={() => setCurrentRoom("home")} />;
      case "office":
        return <OfficeRoom onBack={() => setCurrentRoom("home")} />;
      case "kitchen":
        return <KitchenRoom onBack={() => setCurrentRoom("home")} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-room p-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 animate-float-in">
                <h1 className="text-6xl font-bold text-foreground mb-4 bg-gradient-calm bg-clip-text text-transparent">
                  Zen Break
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Find peace through therapeutic destruction. Choose your sanctuary and let the stress melt away.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {rooms.map((room) => (
                  <Card
                    key={room.id}
                    className={`${room.color} p-8 hover:shadow-glow transition-all duration-500 cursor-pointer group animate-float-in border-2 hover:border-primary/30`}
                    onClick={() => setCurrentRoom(room.id)}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-6 group-hover:animate-gentle-pulse">
                        {room.icon}
                      </div>
                      <h2 className="text-2xl font-semibold text-foreground mb-3">
                        {room.name}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {room.description}
                      </p>
                      <Button 
                        variant="outline" 
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                      >
                        Enter Room
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center text-muted-foreground">
                <p className="text-sm">
                  Click on objects to experience satisfying, stress-relieving interactions
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {currentRoom !== "home" && (
        <Button
          variant="outline"
          size="sm"
          className="fixed top-6 left-6 z-50 bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
          onClick={() => setCurrentRoom("home")}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      )}
      {renderRoom()}
    </div>
  );
};
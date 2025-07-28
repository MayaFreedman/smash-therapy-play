import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface TestRoomProps {
  onBack: () => void;
}

export const TestRoom = ({ onBack }: TestRoomProps) => {
  return (
    <div className="min-h-screen bg-gradient-room p-6 relative">
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
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Level test</h2>
          <p className="text-xl text-muted-foreground">
            This is an empty testing space
          </p>
        </div>
      </div>
    </div>
  );
};
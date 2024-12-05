import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PushupCounterProps {
  count: number;
  goal?: number;
}

export default function PushupCounter({ count, goal = 10 }: PushupCounterProps) {
  const progress = Math.min((count / goal) * 100, 100);

  return (
    <Card className="p-6">
      <div className="mb-4 text-center">
        <h2 className="text-6xl font-bold text-primary">{count}</h2>
        <p className="text-sm text-muted-foreground">Push-ups</p>
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} />
        <p className="text-center text-sm text-muted-foreground">
          Goal: {goal} push-ups
        </p>
      </div>
    </Card>
  );
}

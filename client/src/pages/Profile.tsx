import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import ParticleBackground from "../components/ParticleBackground";

interface WorkoutHistory {
  id: number;
  pushups: number;
  createdAt: string;
}

export default function Profile() {
  const { data: history } = useQuery<WorkoutHistory[]>({
    queryKey: ["workoutHistory"],
    queryFn: async () => {
      const response = await fetch("/api/workouts/history");
      if (!response.ok) throw new Error("Failed to fetch history");
      return response.json();
    },
  });

  const totalPushups = history?.reduce((sum, workout) => sum + workout.pushups, 0) || 0;

  return (
    <div className="container mx-auto mb-20 mt-24 space-y-8 px-4 md:mt-20">
      <ParticleBackground />

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Workout Statistics</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">Total Push-ups</dt>
                <dd className="text-3xl font-bold text-primary">{totalPushups}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Workouts</dt>
                <dd className="text-3xl font-bold text-primary">
                  {history?.length || 0}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history?.slice(0, 5).map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{workout.pushups} Push-ups</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(workout.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

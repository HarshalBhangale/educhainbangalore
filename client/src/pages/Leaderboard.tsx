import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ParticleBackground from "../components/ParticleBackground";

interface LeaderboardEntry {
  id: number;
  username: string;
  totalPushups: number;
  rank: number;
}

export default function Leaderboard() {
  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
  });

  return (
    <div className="container mx-auto mb-20 mt-24 px-4 md:mt-20">
      <ParticleBackground />

      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
          <CardDescription>Top performers this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard?.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                      entry.rank <= 3
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <div>
                    <p className="font-medium">{entry.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.totalPushups} Push-ups
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

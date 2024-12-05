import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Trophy, User } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full border-t border-border bg-background/80 backdrop-blur-sm md:top-0 md:h-16 md:border-b md:border-t-0">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-center gap-4 px-4">
        <Button
          variant={location === "/" ? "default" : "ghost"}
          asChild
          className="flex-1 md:flex-none"
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Workout
          </Link>
        </Button>
        
        <Button
          variant={location === "/leaderboard" ? "default" : "ghost"}
          asChild
          className="flex-1 md:flex-none"
        >
          <Link href="/leaderboard">
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </Link>
        </Button>

        <Button
          variant={location === "/profile" ? "default" : "ghost"}
          asChild
          className="flex-1 md:flex-none"
        >
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </Button>
      </div>
    </nav>
  );
}

import { useState, useEffect } from "react";
import WorkoutCamera from "../components/WorkoutCamera";
import PushupCounter from "../components/PushupCounter";
import ParticleBackground from "../components/ParticleBackground";
import { initializeDetector, detectPushup } from "../lib/pushupDetection";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [pushupCount, setPushupCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const setupDetector = async () => {
      try {
        await initializeDetector();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize camera detection. Please refresh and try again.",
          variant: "destructive",
        });
      }
    };
    setupDetector();
  }, [toast]);

  const savePushupsMutation = useMutation({
    mutationFn: async (count: number) => {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pushups: count }),
      });
      if (!response.ok) throw new Error("Failed to save workout");
    },
    onSuccess: () => {
      toast({
        title: "Workout saved!",
        description: `Completed ${pushupCount} push-ups`,
      });
    },
  });

  const handleFrame = async (video: HTMLVideoElement) => {
    const isPushup = await detectPushup(video);
    if (isPushup) {
      setPushupCount((prev) => prev + 1);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    savePushupsMutation.mutate(pushupCount);
  };

  return (
    <div className="container mx-auto mb-20 mt-24 space-y-8 px-4 md:mt-20">
      <ParticleBackground />
      
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Push-up Challenge</h1>
        <p className="text-muted-foreground">
          Position yourself in view of the camera and start your workout
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <WorkoutCamera
          onFrame={handleFrame}
          isRecording={isRecording}
          onStartRecording={() => setIsRecording(true)}
          onStopRecording={handleStopRecording}
        />
        <PushupCounter count={pushupCount} />
      </div>
    </div>
  );
}

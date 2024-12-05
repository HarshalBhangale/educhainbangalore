import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle } from "lucide-react";

interface WorkoutCameraProps {
  onFrame: (video: HTMLVideoElement) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export default function WorkoutCamera({
  onFrame,
  isRecording,
  onStartRecording,
  onStopRecording,
}: WorkoutCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let animationFrame: number;

    const processFrame = () => {
      if (videoRef.current && isRecording) {
        onFrame(videoRef.current);
      }
      animationFrame = requestAnimationFrame(processFrame);
    };

    if (isRecording) {
      processFrame();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRecording, onFrame]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      onStartRecording();
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    onStopRecording();
  };

  return (
    <Card className="overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-[60vh] w-full object-cover"
      />
      <div className="flex justify-center gap-4 p-4">
        {!isRecording ? (
          <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopCamera}>
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}
      </div>
    </Card>
  );
}

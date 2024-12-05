import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "../components/LoginForm";
import ParticleBackground from "../components/ParticleBackground";

export default function Auth() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <ParticleBackground />
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Push-up Challenge</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

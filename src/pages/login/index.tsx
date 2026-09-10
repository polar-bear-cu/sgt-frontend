import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-xl font-bold">Login</h2>
      <Button>Sign in with Google</Button>
    </div>
  );
}

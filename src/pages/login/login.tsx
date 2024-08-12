import { Button } from "@nextui-org/react";
import { useSupabase } from "../../hooks/use-supabase";

export function LoginPage() {
  const { auth } = useSupabase();
  const url = window.location.origin;
  const redirectTo = `${url}/dashboard`;
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button
        color="primary"
        onClick={() => {
          auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo },
          });
        }}
      >
        Login with Google
      </Button>
    </div>
  );
}

import { useSupabase } from "../../hooks/use-supabase";

export function LoginPage() {
  const { auth } = useSupabase();
  return (
    <button
      onClick={() => {
        auth.signInWithOAuth({
          provider: "google",
        });
      }}
    >
      google
    </button>
  );
}

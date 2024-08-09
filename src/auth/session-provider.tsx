import { ReactNode, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { SessionContext } from "./session-context";
import { Navigate } from "react-router-dom";
import { Session } from "../data/session";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (event === "SIGNED_IN") {
        setSession(session as Session);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        // Go to login
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <></>;

  if (!session) return <Navigate to={"/login"} />;

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

import { createContext, useContext } from "react";
import { Session } from "../data/session";

export const SessionContext = createContext<Session | null>(null);

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be inside of SessionContext.Provider");
  }
  return context;
}

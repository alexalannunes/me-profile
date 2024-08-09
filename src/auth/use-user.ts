import { useSession } from "./session-context";

export function useUser() {
  const session = useSession();
  return session?.user.user_metadata;
}

import { useUser } from "../../auth/use-user";
import { useSupabase } from "../../hooks/use-supabase";
import { clx } from "../../lib/classnames";

export function DashboardPage() {
  const user = useUser();
  const { auth } = useSupabase();

  return (
    <div>
      <h1 className={`text-3xl ${clx("font-semibold", "text-red-300")}`}>
        {user?.name}
        <img src={user?.avatar_url} alt="alex" />
      </h1>

      <button
        onClick={() => {
          auth.signOut();
        }}
      >
        leave
      </button>
    </div>
  );
}

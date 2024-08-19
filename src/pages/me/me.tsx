import { Avatar, CircularProgress } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSupabase } from "../../hooks/use-supabase";
import { useParams } from "react-router-dom";
import { UserPage } from "../../data/user-page";

export function MePage() {
  const supabase = useSupabase();

  const { username: usernameParam } = useParams();

  const [username, setUsername] = useState<UserPage | null>(null);

  useEffect(() => {
    supabase
      .from("usernames")
      .select("id,username,name,image_path,background")
      .eq("username", usernameParam)
      .then((result) => {
        if (result) {
          const data = result?.data?.[0] as UserPage;
          setUsername(data);
        }
      });
  }, [supabase, usernameParam]);

  return (
    <div
      className="flex min-h-screen flex-1 flex-col items-center justify-center gap-10"
      style={{
        background: username?.background || "bg-white",
      }}
    >
      {!username ? (
        <CircularProgress label="Loading..." />
      ) : (
        <>
          <Avatar
            name="Alex"
            className="h-[120px] w-[120px] shadow-md"
            src={username.image_path}
          />
          <h1 className="text-4xl font-semibold">{username.name}</h1>
        </>
      )}
    </div>
  );
}

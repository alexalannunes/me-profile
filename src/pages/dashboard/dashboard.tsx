import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Input,
  User,
} from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "../../auth/session-context";
import { useUser } from "../../auth/use-user";
import { UserPage } from "../../data/user-page";
import { useSupabase } from "../../hooks/use-supabase";
import { DashboardLayout } from "./layout";

export function DashboardPage() {
  const user = useUser();
  const session = useSession();

  const [username, setUsername] = useState<UserPage>({
    id: 0,
    username: "",
    name: user?.name as string,
  });
  const [fileInstance, setFileInstance] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState({
    name: false,
    username: false,
    image: false,
  });

  const usernameRef = useRef(username);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const supabase = useSupabase();

  const storePreviousUserData = useCallback(() => {
    supabase
      .from("usernames")
      .insert({
        user_id: session?.user.id,
        name: user?.name,
        // apply regex here
        username: user?.name.toLowerCase().replace(/\s/g, "-"),
      })
      .select("id,username,name")
      .single()
      .then((result) => {
        if (result.error) {
          alert("Error");
          return;
        }

        setUsername(result.data as UserPage);
      });
  }, [session, supabase, user?.name]);

  useEffect(() => {
    setIsLoading((prev) => ({
      ...prev,
      username: true,
      name: true,
      image: true,
    }));
    supabase
      .from("usernames")
      .select("id,username,name,image_path")
      .eq("user_id", session?.user.id)
      .then((result) => {
        if (!result.data?.length) {
          storePreviousUserData();
          return;
        }
        if (result) {
          const data = result?.data?.[0] as UserPage;
          setUsername(data);
          usernameRef.current = data;
        }
      })
      .then(() => {
        setIsLoading((prev) => ({
          ...prev,
          username: false,
          name: false,
          image: false,
        }));
      });
  }, [supabase, session?.user.id, storePreviousUserData]);

  return (
    <DashboardLayout>
      <div className="w-[320px] border-r border-slate-300">
        <div className="flex h-16 items-center px-2">
          <User
            name={user?.name}
            description={user?.email}
            avatarProps={{
              src: user?.avatar_url,
            }}
          />
        </div>
        <Divider />

        <div className="flex flex-col gap-2 p-2">
          <h4 className="font-semibold">Page props</h4>
          <div className="flex flex-col gap-2">
            <Input
              variant="faded"
              label="Username"
              value={username?.name}
              onChange={(e) =>
                setUsername((prev) => ({ ...prev, name: e.target.value }))
              }
              endContent={
                isLoading.name && (
                  <CircularProgress size="sm" aria-label="Loading..." />
                )
              }
              onBlur={() => {
                if (username?.name.trim() !== usernameRef.current.name.trim()) {
                  setIsLoading((prev) => ({
                    ...prev,
                    name: true,
                  }));
                  supabase
                    .from("usernames")
                    .update({
                      name: username?.name.trim(),
                    })
                    .eq("id", username.id)
                    .then(() => {
                      setIsLoading((prev) => ({
                        ...prev,
                        name: false,
                      }));
                    });
                }
              }}
            />
            <Input
              variant="faded"
              label="Username"
              value={username?.username}
              onChange={(e) =>
                setUsername((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              endContent={
                isLoading.username && (
                  <CircularProgress size="sm" aria-label="Loading..." />
                )
              }
              onBlur={() => {
                if (
                  username?.username.trim() !==
                  usernameRef.current.username.trim()
                ) {
                  setIsLoading((prev) => ({ ...prev, username: true }));

                  supabase
                    .from("usernames")
                    .update({
                      username: username.username.trim(),
                    })
                    .eq("id", username.id)
                    .then(() => {
                      setIsLoading((prev) => ({ ...prev, username: false }));
                      usernameRef.current = username;
                    });
                }
              }}
            />
            <Input
              variant="faded"
              readOnly
              placeholder="Select an image"
              label="Image"
              startContent={
                <Avatar
                  size="sm"
                  className="h-5 w-5 flex-shrink-0"
                  src={username.image_path}
                  name={username.name}
                />
              }
              onChange={() => {}}
              value={username.image_path || fileInstance?.name || ""}
              endContent={
                isLoading.image ? (
                  <CircularProgress size="sm" aria-label="Loading..." />
                ) : fileInstance?.name ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (inputFileRef.current) {
                        setFileInstance(null);
                        inputFileRef.current.value = "";
                      }
                    }}
                  >
                    Clear
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      inputFileRef.current?.click();
                    }}
                    size="sm"
                  >
                    Select
                  </Button>
                )
              }
            />
            <input
              ref={inputFileRef}
              accept="image/*"
              value={""}
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];

                  setFileInstance(file);
                  setIsLoading((prev) => ({
                    ...prev,
                    image: true,
                  }));

                  // change all to async/await
                  supabase.storage
                    .from("me-profile")
                    // same file name will throw error
                    .upload(`public/${file.name}`, file, {
                      // no cache
                      cacheControl: "0",
                    })
                    .then((result) => {
                      if (result.error) {
                        alert(result.error.message || "Error");
                        console.log(result.error);
                        return;
                      }

                      const publicUrl = supabase.storage
                        .from("me-profile")
                        .getPublicUrl(`public/${file.name}`).data.publicUrl;

                      supabase
                        .from("usernames")
                        .update({
                          image_path: publicUrl,
                        })
                        .eq("id", username.id)
                        .then(() => {
                          setIsLoading((prev) => ({
                            ...prev,
                            image: false,
                          }));
                          setUsername((prev) => ({
                            ...prev,
                            image_path: publicUrl,
                          }));
                          if (inputFileRef.current) {
                            inputFileRef.current.value = "";
                          }
                        });
                    });
                }
              }}
              className="hidden"
              type="file"
            />
          </div>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center gap-10">
        {/* if user does not change image ? */}
        <Avatar
          name="Alex"
          className="h-[120px] w-[120px] object-contain shadow-md"
          src={username?.image_path || user?.avatar_url}
          fallback={<CircularProgress aria-label="Loading..." />}
        />
        <h1 className="text-4xl font-semibold">{username?.name}</h1>

        <Button
          className="absolute right-10 top-4"
          as={"a"}
          color="primary"
          variant="shadow"
          // href={`${user?.username}`}
          href={`${username?.username}`}
        >
          Preview
        </Button>
      </div>
    </DashboardLayout>
  );
}

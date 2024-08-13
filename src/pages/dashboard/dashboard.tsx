import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Input,
  User,
} from "@nextui-org/react";
import { useCallback, useEffect, useRef } from "react";
import { useSession } from "../../auth/session-context";
import { useUser } from "../../auth/use-user";
import { UserPage } from "../../data/user-page";
import { useSupabase } from "../../hooks/use-supabase";
import { DashboardLayout } from "./layout";
import { userService } from "./services";
import { useLoading } from "./use-loading";
import { useUserPage } from "./use-user-page";

export function DashboardPage() {
  const user = useUser();
  const session = useSession();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const supabase = useSupabase();
  const loading = useLoading();

  const {
    setLoadingImage,
    setLoadingName,
    setLoadingUsername,
    reset,
    allLoading,
  } = loading;

  const {
    handleChangeName,
    handleChangeUsername,
    handleSaveName,
    handleSaveUsername,
    username,
    setUsername,
    fileInstance,
    setFileInstance,
    handleChangeAvatar,
  } = useUserPage();

  const usernameRef = useRef(username);

  const storePreviousUserData = useCallback(async () => {
    const result = await userService.initialStoreUserData(
      session?.user.id,
      user?.name,
    );
    if (result.error) {
      console.log(result.error);
      return;
    }

    setUsername(result.data as UserPage);
  }, [session, user?.name, setUsername]);

  useEffect(() => {
    async function init() {
      allLoading();

      const result = await userService.getUserData(session?.user.id);

      if (result.error) {
        console.log("Error", result);
      }

      if (!result.data?.length) {
        storePreviousUserData();
      } else if (result.data) {
        const data = result?.data?.[0] as UserPage;
        setUsername(data);
        usernameRef.current = data;
      }

      reset();
    }

    init();
  }, [session?.user.id, storePreviousUserData, allLoading, reset, setUsername]);

  const user_id = username.id;
  const image_path = username.image_path;
  const has_uploaded_avatar_url = username.has_uploaded_avatar_url;
  const user_session_id = session?.user.id;

  useEffect(() => {
    if (
      user?.avatar_url &&
      user_id &&
      !image_path &&
      !has_uploaded_avatar_url
    ) {
      userService.storeAvatarSessionUser(
        user.avatar_url,
        user_session_id,
        user_id,
      );
    }
  }, [
    user,
    supabase,
    user_id,
    has_uploaded_avatar_url,
    image_path,
    username,
    user_session_id,
  ]);

  return (
    <DashboardLayout>
      <div className="w-[320px] border-r border-slate-300">
        <div className="flex h-16 items-center justify-between px-2">
          <User
            name={user?.name}
            description={user?.email}
            avatarProps={{
              src: user?.avatar_url,
            }}
          />
          <Button
            onClick={() => supabase.auth.signOut()}
            color="danger"
            variant="flat"
            size="sm"
          >
            Logout
          </Button>
        </div>
        <Divider />

        <div className="flex flex-col gap-2 p-2">
          <h4 className="font-semibold">Page props</h4>
          <div className="flex flex-col gap-2">
            <Input
              variant="faded"
              label="Username"
              value={username?.name}
              onChange={(e) => handleChangeName(e.target.value)}
              endContent={
                loading.isNameLoading && (
                  <CircularProgress size="sm" aria-label="Loading..." />
                )
              }
              onBlur={async () => {
                if (username?.name.trim() !== usernameRef.current.name.trim()) {
                  setLoadingName();
                  await handleSaveName();
                  reset();
                }
              }}
            />
            <Input
              variant="faded"
              label="Username"
              value={username?.username}
              onChange={(e) => handleChangeUsername(e.target.value)}
              endContent={
                loading.isUsernameLoading && (
                  <CircularProgress size="sm" aria-label="Loading..." />
                )
              }
              onBlur={async () => {
                if (
                  username?.username.trim() !==
                  usernameRef.current.username.trim()
                ) {
                  setLoadingUsername();
                  await handleSaveUsername();
                  reset();
                  usernameRef.current = username;
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
                loading.isImageLoading ? (
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
              onChange={async (e) => {
                if (e.target.files) {
                  const file = e.target.files[0];

                  setFileInstance(file);
                  setLoadingImage();

                  await handleChangeAvatar(file);
                  reset();
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
          src={username?.image_path}
          fallback={<CircularProgress aria-label="Loading..." />}
        />
        <h1 className="text-4xl font-semibold">{username?.name}</h1>

        <Button
          className="absolute right-10 top-4"
          as={"a"}
          color="primary"
          variant="shadow"
          href={`${username?.username}`}
        >
          Preview
        </Button>
      </div>
    </DashboardLayout>
  );
}

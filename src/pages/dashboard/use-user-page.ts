import { useRef, useState } from "react";
import { useUser } from "../../auth/use-user";
import { UserPage } from "../../data/user-page";
import { userService } from "./services";

export function useUserPage() {
  const user = useUser();

  const [username, setUsername] = useState<UserPage>({
    id: 0,
    username: "",
    name: user?.name as string,
    image_path: "",
    has_uploaded_avatar_url: false,
  });
  const [fileInstance, setFileInstance] = useState<File | null>(null);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleChangeName = (name: string) => {
    setUsername((prev) => ({ ...prev, name }));
  };
  const handleChangeUsername = (username_: string) => {
    setUsername((prev) => ({ ...prev, username: username_ }));
  };

  const handleChangeAvatar = async (file: File) => {
    const fileData = await userService.uploadAvatar(
      Date.now() + "_" + file.name,
      file,
    );

    if (fileData) {
      await userService.saveUserAvatar(fileData?.publicUrl, username.id);
      setUsername((prev) => ({
        ...prev,
        image_path: fileData.publicUrl,
      }));
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    }
  };

  const handleSaveName = async () => {
    await userService.saveName(username.id, username.name);
  };

  const handleSaveUsername = async () => {
    await userService.saveUsername(username.id, username.username);
  };

  return {
    handleChangeName,
    handleChangeUsername,
    handleSaveName,
    handleSaveUsername,
    username,
    setUsername,
    fileInstance,
    setFileInstance,
    handleChangeAvatar,
  };
}

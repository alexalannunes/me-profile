import { supabase } from "../../lib/supabase";

async function initialStoreUserData(sessionUserId?: string, userName?: string) {
  const result = await supabase
    .from("usernames")
    .insert({
      user_id: sessionUserId,
      name: userName,
      // apply regex here
      username: userName?.toLowerCase()?.replace(/\s/g, "-"),
    })
    .select("id,username,name")
    .single();

  return result;
}

async function getUserData(sessionUserId?: string) {
  const result = await supabase
    .from("usernames")
    .select("id,username,name,image_path,has_uploaded_avatar_url")
    .eq("user_id", sessionUserId);

  return result;
}

async function uploadAvatar(filename: string, file: Blob) {
  const result = await supabase.storage
    .from("me-profile")
    // same file name will throw error
    .upload(`public/${filename}`, file, {
      // no cache
      cacheControl: "0",
    });

  if (result.error) {
    alert(result.error.message || "Error");
    console.log(result.error);
    return;
  }

  const publicUrl = supabase.storage
    .from("me-profile")
    .getPublicUrl(`public/${filename}`).data.publicUrl;

  return {
    filename,
    publicUrl,
  };
}

async function saveUserAvatar(publicUrl: string, userId: number) {
  await supabase
    .from("usernames")
    .update({
      image_path: publicUrl,
    })
    .eq("id", userId);

  return publicUrl;
}

async function storeAvatarSessionUser(
  avatar_url: string,
  userSessionId?: string,
  userId?: number,
) {
  const request = await fetch(avatar_url);
  const result = await request.blob();

  if (result.size) {
    const fileData = await uploadAvatar(
      `provider_image_${userSessionId}.jpeg`,
      result,
    );

    if (fileData) {
      await supabase
        .from("usernames")
        .update({
          has_uploaded_avatar_url: true,
          image_path: fileData.publicUrl,
        })
        .eq("id", userId);
    }
  }
}

async function saveName(userId: number, name: string) {
  const result = await supabase
    .from("usernames")
    .update({
      name: name.trim(),
    })
    .eq("id", userId);

  return result;
}

async function saveUsername(userId: number, username: string) {
  const result = await supabase
    .from("usernames")
    .update({
      username: username.trim(),
    })
    .eq("id", userId);
  return result;
}

const userService = {
  initialStoreUserData,
  getUserData,
  saveUserAvatar,
  storeAvatarSessionUser,
  uploadAvatar,
  saveName,
  saveUsername,
};

export { userService };

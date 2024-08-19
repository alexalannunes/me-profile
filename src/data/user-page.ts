export interface UserPage {
  id: number;
  username: string;
  name: string;
  image_path: string;
  has_uploaded_avatar_url?: boolean;
  background?: string;
}

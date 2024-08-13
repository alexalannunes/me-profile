import {
  Session as SupabaseSession,
  User as SupabaseUser,
} from "@supabase/supabase-js";

export interface User extends Omit<SupabaseUser, "user_metadata"> {
  user_metadata: {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;

    //
    // username?: string;
  };
}

export interface Session extends Omit<SupabaseSession, "user"> {
  user: User;
}

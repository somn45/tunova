import { CurrentListenersInsert } from "@/src/entities/models/user";
import { User } from "@supabase/supabase-js";

export interface IUserRepository {
  getUser(): Promise<{
    success: boolean;
    getUserMessage: string;
    data: User | null;
  }>;
  insertCurrentListeners(listenedTracks: Array<CurrentListenersInsert>): {};
}

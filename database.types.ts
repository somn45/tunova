import { Database as DatabaseGenerated } from "@/database-generated.types";
import { MergeDeep } from "type-fest";

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        current_listeners: {
          Insert: {
            current_listened_track_id: number;
            profile_id?: string;
          };
        };
      };
    };
  }
>;

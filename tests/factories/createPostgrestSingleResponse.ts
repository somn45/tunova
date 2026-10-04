import { PostgrestResponseFailure } from "@supabase/postgrest-js";
import { PostgrestError } from "@supabase/supabase-js";

export function createMockPostgrestError(
  overrides: Partial<PostgrestError> = {},
): PostgrestError {
  return {
    name: "PostgrestError",
    message: "",
    details: "",
    hint: "",
    code: "",
    toJSON: () => ({ name: "", message: "", details: "", hint: "", code: "" }),
    ...overrides,
  };
}

export function createMockPostgrestResponseFailure(
  overrides: Partial<PostgrestResponseFailure> = {},
): PostgrestResponseFailure {
  return {
    data: null,
    error: createMockPostgrestError(),
    success: false,
    count: null,
    status: 500,
    statusText: "",
    ...overrides,
  };
}

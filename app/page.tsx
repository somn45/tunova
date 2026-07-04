import { createClient } from "@/libs/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const response = await supabase.from("goods").select();
  console.log(response.data);

  return <div>Hello World</div>;
}

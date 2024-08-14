import { createClient } from "@/utils/supabase/server";
import { saveNickname } from "@/app/login/actions";

export default async function NicknamePage() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return <div>Error loading user data</div>;
  }

  if (!user) {
    return <div>Please log in to set your nickname</div>;
  }

  return (
    <form action={saveNickname} method="post">
      <input
        id="nickname"
        name="nickname"
        type="text"
        placeholder="Tu apodo"
        className="input-login text-[#2b2b2b] placeholder:text-[#2b2b2b]"
        required
      />
      <button type="submit" className="btn ml-4">
        Guardar
      </button>
    </form>
  );
}

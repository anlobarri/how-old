import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  const { data: userPublic, error: userPublicError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.user?.id);

  return (
    <>
      {userPublic ? (
        <>
          <button>Bienvenido {userPublic[0]?.nickname}</button>
          <Link href="/quiz" className="btn">
            Empezar
          </Link>
        </>
      ) : (
        <>
          <Link href="/login" className="btn">
            Registrar o iniciar sesión
          </Link>
          <Link href="/quiz" className="btn">
            Empezar
          </Link>
        </>
      )}
    </>
  );
}

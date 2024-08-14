import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (!user) {
    return <div>No se encontró el usuario</div>;
  }

  const { data: userPublic, error: userPublicError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.user?.id);

  return (
    <>
      {userPublic && userPublic[0] ? (
        <>
          <button>Bienvenido {userPublic[0]?.nickname}</button>
          <Link href="/quiz" className="btn">
            Empezar
          </Link>
        </>
      ) : (
        <>
          <Link href="/login" className="btn">
            Registrate o inicia sesión para jugar
          </Link>
        </>
      )}
    </>
  );
}

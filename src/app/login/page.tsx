import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-2 text-[#2b2b2b] px-4">
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Tu email"
        className="input-login"
        required
      />
      <input
        id="password"
        name="password"
        type="password"
        required
        placeholder="Tu contraseña"
        className="input-login"
      />

      <div className="inline-flex gap-2 justify-center">
        <button formAction={login} className="btn">
          Inicar sesión
        </button>
        <button formAction={signup} className="btn">
          Registrarse
        </button>
      </div>
      <p className="text-center text-slate-400">
        La contraseña debe de tener 6 carácteres como mínimo
      </p>
    </form>
  );
}

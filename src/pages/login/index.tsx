import { useState } from "react";
import { toast } from "react-toastify";
import { getUserByEmail } from "../../services/user/user.service";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await getUserByEmail(email);
      localStorage.setItem("user", JSON.stringify(response));
      navigate("/productions");
    } catch (e) {
      toast.error("Erro ao tentar logar, tente novamente mais tarde.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex p-10 rounded-md items-center justify-center bg-gray-100 ">
        <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
            Login
          </h1>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />

            <button
              onClick={() => {
                handleLogin();
              }}
              className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

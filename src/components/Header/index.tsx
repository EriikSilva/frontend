import { NavLink, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="mb-4 bg-gray-200 px-6 py-4 shadow">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex w-full justify-between"
      >
        <NavLink
          to="/productions"
          end
          className={({ isActive }) =>
            `rounded-md px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-300"
            }`
          }
        >
          Productions
        </NavLink>

        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
        >
          Sair
        </button>
      </nav>
    </header>
  );
}

export default Header;


import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="mb-4 bg-gray-200 px-6 py-4 shadow">
      <nav aria-label="Navegação principal" className="mx-auto flex max-w-5xl gap-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `rounded-md px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-300'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `rounded-md px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-300'
            }`
          }
        >
          Products
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useLocation } from 'react-router-dom';

export default function AppBar() {
  const location = useLocation();

  // Check if the current location is either '/login' or '/signup'
  const showNavBar = !(location.pathname === '/login' || location.pathname === '/signup');

  // Conditionally render the NavBar
  return showNavBar && (
    <nav className="bg-slate-800 text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <img
            src="/logo.svg"
            width={40}
            height={40}
            alt=""
            className="rounded-full"
          />
        </div>

        <ul className="flex items-center space-x-4">
          <li>
            <Link to={'/signup'}>
              <Button>Sign Up</Button>
            </Link>
          </li>
          <li>
            <Link to={'/login'}>
              <Button>Log In</Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

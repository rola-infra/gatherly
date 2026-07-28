import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate("/events");
  };

  const hideOn = ["/login", "/signup"];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/80 backdrop-blur">
      <nav className="container-page flex items-center justify-between py-3">
        <Link
          to="/events"
          onClick={closeMenu}
          className="font-display text-xl font-extrabold text-brand-600"
        >
          Gatherly
        </Link>

        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <>
              <Link to="/events/new" className="btn btn-primary">
                Create event
              </Link>
              <Link to="/my" className="btn btn-ghost">
                My events
              </Link>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="btn btn-ghost p-2 sm:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-ink-100 bg-white sm:hidden">
          <div className="container-page flex flex-col gap-2 py-4">
            {user ? (
              <>
                <Link
                  to="/events/new"
                  onClick={closeMenu}
                  className="btn btn-primary w-full"
                >
                  Create event
                </Link>
                <Link
                  to="/my"
                  onClick={closeMenu}
                  className="btn btn-outline w-full"
                >
                  My events
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost w-full">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn btn-outline w-full"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="btn btn-primary w-full"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

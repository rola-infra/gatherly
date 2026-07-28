import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger
  const [accountOpen, setAccountOpen] = useState(false); // desktop account dropdown
  const menuRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    setAccountOpen(false);
    await logout();
    navigate("/events");
  };

  // Close the desktop account menu on outside-click or Escape.
  useEffect(() => {
    if (!accountOpen) return;

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [accountOpen]);

  const hideOn = ["/login", "/signup"];
  if (hideOn.includes(location.pathname)) return null;

  const initial = user ? user.name.charAt(0).toUpperCase() : "";

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

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setAccountOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-ink-100"
                  aria-label="Account menu"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {initial}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-ink-400 transition ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-lg">
                    <div className="flex items-center gap-3 border-b border-ink-100 p-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 text-base font-semibold text-brand-700">
                        {initial}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink-800">
                          {user.name}
                        </p>
                        <p className="truncate text-sm text-ink-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-ink-700 hover:bg-ink-50"
                    >
                      <LogOut size={16} className="text-ink-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
                <div className="flex items-center gap-3 border-b border-ink-100 pb-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 text-base font-semibold text-brand-700">
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-800">
                      {user.name}
                    </p>
                    <p className="truncate text-sm text-ink-500">
                      {user.email}
                    </p>
                  </div>
                </div>

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

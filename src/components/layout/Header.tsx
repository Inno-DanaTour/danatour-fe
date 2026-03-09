import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  MapPin,
  User,
  LogOut,
  Package,
  PlusCircle,
} from "lucide-react";
import { parseJwt, getToken } from "../../configs/api";

interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface HeaderProps {
  onBookClick: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Da Nang Explore", href: "/explore" },
  { label: "Find Tour", href: "/tours" },
  { label: "About", href: "/about" },
  { label: "Become a Partner", href: "/provider/apply" },
];

const PROVIDER_NAV_ITEMS: NavItem[] = [
  { label: "Tour Management", href: "/tours/manage" },
  { label: "Booking Management", href: "/tours/bookings" },
];

const Header: React.FC<HeaderProps> = ({ onBookClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showManagementMenu, setShowManagementMenu] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check initial auth status
    const token = getToken();
    setIsAuthenticated(!!token);

    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.scope) {
        const roles =
          typeof payload.scope === "string" ? payload.scope.split(" ") : [];
        if (
          roles.includes("ROLE_TOUR_COMPANY") ||
          roles.includes("TOUR_COMPANY")
        ) {
          setUserRole("TOUR_COMPANY");
        }
      }
    }

    const handleStorageChange = () => {
      const newToken = getToken();
      setIsAuthenticated(!!newToken);
      if (!newToken) {
        setUserRole(null);
      } else {
        const payload = parseJwt(newToken);
        const scope = payload && payload.scope ? payload.scope : "";
        const roles = typeof scope === "string" ? scope.split(" ") : [];
        if (
          roles.includes("ROLE_TOUR_COMPANY") ||
          roles.includes("TOUR_COMPANY")
        ) {
          setUserRole("TOUR_COMPANY");
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
    setShowProfileMenu(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Add background when scrolled
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsMenuOpen(false);

    // Check if it's a hash link on the current page
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Check if it's a route with a hash
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (location.pathname === path) {
        // Already on the page, just scroll
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to the page, hash will be handled there
        navigate(href);
      }
      return;
    }

    // Regular route navigation
    navigate(href);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href.split("#")[0]);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300 ${
          isScrolled
            ? "bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl"
            : "bg-black/30 backdrop-blur-md border border-white/5"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => handleNavClick(e, "/")}
              className="flex items-center gap-0 cursor-pointer group"
            >
              <img
                src="/logo.png"
                alt="DanaTour"
                className="w-20 h-20 object-contain drop-shadow-lg group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold text-white tracking-tight font-display">
                Dana<span className="text-accent">Tour</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.filter(
                (item) =>
                  !(
                    item.label === "Become a Partner" &&
                    userRole === "TOUR_COMPANY"
                  ),
              ).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-white/10 cursor-pointer ${
                    isActive(item.href)
                      ? "text-accent"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}

              {/* Provider Management Dropdown */}
              {userRole === "TOUR_COMPANY" && (
                <div className="relative">
                  <button
                    onClick={() => setShowManagementMenu(!showManagementMenu)}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    Management
                    <motion.span
                      animate={{ rotate: showManagementMenu ? 180 : 0 }}
                      className="inline-block"
                    >
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {showManagementMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-56 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl py-2 overflow-hidden"
                      >
                        {PROVIDER_NAV_ITEMS.map((item) => (
                          <button
                            key={item.href}
                            onClick={(e) => {
                              setShowManagementMenu(false);
                              handleNavClick(e as any, item.href);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            {item.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
                  >
                    <User className="text-white w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl py-2 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/profile");
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/my-bookings");
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          My Bookings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors flex items-center gap-2"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 text-sm font-bold text-white hover:text-accent transition-colors cursor-pointer"
                  >
                    Log in
                  </button>

                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 text-sm font-bold text-white hover:text-accent transition-colors cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBookClick}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-sea text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all cursor-pointer"
              >
                Book Now
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-72 h-full bg-[#0f172a]/95 backdrop-blur-xl border-l border-white/10 p-6"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {NAV_ITEMS.filter(
                  (item) =>
                    !(
                      item.label === "Become a Partner" &&
                      userRole === "TOUR_COMPANY"
                    ),
                ).map((item, index) => (
                  <motion.button
                    key={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`px-4 py-3 text-lg font-medium hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-left ${
                      isActive(item.href)
                        ? "text-accent"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
                {userRole === "TOUR_COMPANY" && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                    <p className="px-4 text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                      Management
                    </p>
                    {PROVIDER_NAV_ITEMS.map((item, index) => (
                      <motion.button
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        onClick={(e) => handleNavClick(e as any, item.href)}
                        className={`w-full px-4 py-3 text-lg font-medium hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer flex items-center gap-3 ${
                          isActive(item.href)
                            ? "text-accent"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </div>
                )}
                {isAuthenticated && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/my-bookings");
                    }}
                    className="px-4 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer flex items-center gap-3"
                  >
                    <Package size={20} /> My Bookings
                  </motion.button>
                )}
                {isAuthenticated ? (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleLogout}
                    className="px-4 py-3 text-lg font-medium text-red-400 hover:text-red-300 hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer flex items-center gap-3"
                  >
                    <LogOut size={20} /> Logout
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/login");
                      }}
                      className="px-4 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/signup");
                      }}
                      className="px-4 py-3 text-lg font-medium text-accent hover:text-[#ffd666] hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      Sign up
                    </motion.button>
                  </>
                )}
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  setIsMenuOpen(false);
                  onBookClick();
                }}
                className="mt-8 w-full py-4 bg-gradient-to-r from-primary to-sea text-white font-bold rounded-xl shadow-lg cursor-pointer"
              >
                Book Now
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

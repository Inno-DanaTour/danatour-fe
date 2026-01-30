import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin } from "lucide-react";

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
];

const Header: React.FC<HeaderProps> = ({ onBookClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
              {NAV_ITEMS.map((item) => (
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
            </div>
            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
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
                {NAV_ITEMS.map((item, index) => (
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

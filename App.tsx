import React, { useEffect, useMemo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useRoutes,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DaNangExplore from "./pages/DaNangExplore";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import About from "./pages/About";
import Login from "./pages/Login";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  const routes = [
    {
      path: "/",
      element: (
        <PageWrapper>
          <Home />
        </PageWrapper>
      ),
    },
    {
      path: "/explore",
      element: (
        <PageWrapper>
          <DaNangExplore />
        </PageWrapper>
      ),
    },
    {
      path: "/tours",
      element: (
        <PageWrapper>
          <Tours />
        </PageWrapper>
      ),
    },
    {
      path: "/tours/:id",
      element: (
        <PageWrapper>
          <TourDetail />
        </PageWrapper>
      ),
    },
    {
      path: "/checkout",
      element: (
        <PageWrapper>
          <Checkout />
        </PageWrapper>
      ),
    },
    {
      path: "/booking/confirmation",
      element: (
        <PageWrapper>
          <Confirmation />
        </PageWrapper>
      ),
    },
    {
      path: "/about",
      element: (
        <PageWrapper>
          <About />
        </PageWrapper>
      ),
    },
    {
      path: "/login",
      element: (
        <PageWrapper>
          <Login />
        </PageWrapper>
      ),
    },
  ];

  const element = useRoutes(routes);

  return (
    <AnimatePresence mode="wait">
      {element && React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
};

const Layout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  );
};

export default App;

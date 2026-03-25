import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import Footer from "./components/layout/Footer";
import ScrollToTopButton from "./components/layout/ScrollToTopButton";
import { AnimatedRoutes } from "./routes";

const ScrollReset = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen relative">
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      {!isAuthPage && <Footer />}
      <ScrollToTopButton />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollReset />
      <Layout />
    </BrowserRouter>
  );
};

export default App;

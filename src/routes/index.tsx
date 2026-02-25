import React from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import Home from "../pages/home";
import DaNangExplore from "../pages/explore";
import Tours from "../pages/tours";
import TourDetail from "../pages/tour-detail";
import Checkout from "../pages/checkout";
import Confirmation from "../pages/confirmation";
import About from "../pages/about";
import Login from "../pages/login";
import Signup from "../pages/signup";
import CompanyDetail from "../pages/company-detail";
import MyBookings from "../pages/my-bookings";

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

export const AnimatedRoutes = () => {
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
    {
      path: "/signup",
      element: (
        <PageWrapper>
          <Signup />
        </PageWrapper>
      ),
    },
    {
      path: "/companies/:id",
      element: (
        <PageWrapper>
          <CompanyDetail />
        </PageWrapper>
      ),
    },
    {
      path: "/my-bookings",
      element: (
        <PageWrapper>
          <MyBookings />
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

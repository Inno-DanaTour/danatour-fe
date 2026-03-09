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
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";
import VerifyEmail from "../pages/auth/verify-email";
import CompanyDetail from "../pages/company-detail";
import MyBookings from "../pages/my-bookings";
import OAuth2Callback from "../pages/auth/oauth2";
import ChangePassword from "../pages/auth/change-password";
import ProviderOnboarding from "../pages/auth/provider-onboarding";
import ManageTours from "../pages/tours/ManageTours";
import CreateTour from "../pages/tours/CreateTour";
import EditTour from "../pages/tours/EditTour";
import CompanyBookings from "../pages/tours/CompanyBookings";

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
      path: "/tours/manage",
      element: (
        <PageWrapper>
          <ManageTours />
        </PageWrapper>
      ),
    },
    {
      path: "/tours/bookings",
      element: (
        <PageWrapper>
          <CompanyBookings />
        </PageWrapper>
      ),
    },
    {
      path: "/tours/create",
      element: (
        <PageWrapper>
          <CreateTour />
        </PageWrapper>
      ),
    },
    {
      path: "/tours/:id/edit",
      element: (
        <PageWrapper>
          <EditTour />
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
      path: "/verify-email",
      element: (
        <PageWrapper>
          <VerifyEmail />
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
    {
      path: "/oauth2/callback",
      element: (
        <PageWrapper>
          <OAuth2Callback />
        </PageWrapper>
      ),
    },
    {
      path: "/change-password",
      element: (
        <PageWrapper>
          <ChangePassword />
        </PageWrapper>
      ),
    },
    {
      path: "/provider/apply",
      element: (
        <PageWrapper>
          <ProviderOnboarding />
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

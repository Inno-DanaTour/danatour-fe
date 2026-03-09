import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { parseJwt } from "../../../configs/api";

const OAuth2Callback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const processedRef = React.useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const accessToken = searchParams.get("access_token");
    const newUser = searchParams.get("new_user") === "true";
    const userUuid = searchParams.get("user_uuid");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth2 Error:", error);
      processedRef.current = true;
      navigate("/login?error=" + error);
      return;
    }

    if (accessToken) {
      // Save token to localStorage
      localStorage.setItem("token", accessToken);
      processedRef.current = true;

      if (newUser) {
        // Redirect to change password page if it's a new user
        navigate("/change-password");
      } else {
        // Parse token to check roles
        const payload = parseJwt(accessToken);
        const scope = payload?.scope || "";

        if (scope.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          // Redirect to home if existing user
          navigate("/");
        }
      }
    } else {
      // Handle case where no token is provided
      processedRef.current = true;
      navigate("/login?error=missing_token");
    }
  }, [searchParams, navigate]);

  return (
    <div className="w-full h-screen bg-[#004E89] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full border-4 border-[#FFC857] border-t-transparent animate-spin"></div>
        <p className="text-white text-lg font-medium tracking-wider animate-pulse">
          Authenticating...
        </p>
      </motion.div>
    </div>
  );
};

export default OAuth2Callback;

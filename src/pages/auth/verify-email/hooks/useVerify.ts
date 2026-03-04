import { useState, useCallback } from "react";
import {
  verifyEmail as apiVerifyEmail,
  resendVerification as apiResendVerification,
} from "../services/verifyService";

export const useVerify = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const verifyEmail = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await apiVerifyEmail(token);
      setSuccessMsg("Email verified successfully! You can now log in.");
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || "Email verification failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerification = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await apiResendVerification(email);
      setSuccessMsg("A new verification link has been sent to your email.");
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to resend verification email";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyEmail,
    resendVerification,
    loading,
    error,
    successMsg,
  };
};

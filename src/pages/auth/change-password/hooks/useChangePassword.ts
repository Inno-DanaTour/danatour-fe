import { useState } from "react";
import {
  changePassword as apiChangePassword,
  ChangePasswordRequest,
} from "../services/changePasswordService";
import { useNavigate } from "react-router-dom";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    setLoading(true);
    setError(null);
    try {
      await apiChangePassword(data);
      navigate("/"); // Redirect to home on success
    } catch (err: any) {
      const errorMessage = err.message || "Failed to change password";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleChangePassword,
    loading,
    error,
  };
};

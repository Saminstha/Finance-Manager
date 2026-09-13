import { useEffect, type ReactNode } from "react";

import { getCurrentUser } from "@/api/authApi";

import { finishInitialization, logout, setUser } from "./authSlice";

import { useAppDispatch } from "@/store/hooks";

interface AuthInitProps {
  children: ReactNode;
}

export default function AuthInit({ children }: AuthInitProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");

      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken && !refreshToken) {
        dispatch(finishInitialization());
        return;
      }

      try {
        const user = await getCurrentUser();

        dispatch(setUser(user));
      } catch {
        dispatch(logout());
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
}

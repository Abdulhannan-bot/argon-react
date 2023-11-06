import { Navigate } from "react-router-dom";

export const AuthenticatedRoute = ({ children }) => {
  return JSON.parse(localStorage.getItem("userInfo"))?.token ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/login" />
  );
};

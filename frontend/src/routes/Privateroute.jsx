import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const Privateroute = ({ children, allowPublic = false }) => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // console.log({ authUser });

  if (isCheckingAuth ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (allowPublic && authUser) {
    return <Navigate to="/" />;
  }

  // If private route and user not logged in
  if (!allowPublic && !authUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Privateroute;

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const Privateroute = ({ children }) => {
  // let token = sessionStorage.getItem("token")
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return authUser ? children : <Navigate to={"/login"} />;
};

export default Privateroute;

import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/Router";
import { Toaster } from "react-hot-toast";
import { themeStore } from "./store/themeStore";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

const App = () => {
  const { theme } = themeStore();
  return (
    <div data-theme={theme}>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routes} />
    </div>
  );
};

export default App;

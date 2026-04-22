import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Setting from "../pages/Setting";
import Profile from "../pages/Profile";
import Privateroute from "./Privateroute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Privateroute>
            <Home />
          </Privateroute>
        ),
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/profile",
        element: (
          <Privateroute>
            <Profile />
          </Privateroute>
        ),
      },
    ],
  },
]);

import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Setting from "../pages/Setting";
import Profile from "../pages/Profile";
import Privateroute from "./Privateroute";
import VerifyEmail from "../pages/VerifyEmail";

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
        element: (
          <Privateroute allowPublic={true}>
            <SignUp />
          </Privateroute>
        ),
      },
      {
        path: "/login",
        element: (
          <Privateroute allowPublic={true}>
            <Login />
          </Privateroute>
        ),
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
      {
        path: "/verify-email/:rawid",
        element: <VerifyEmail />
      },
    ],
  },
]);

import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AssetsList from "@/pages/businessUser/pages/AssetsList";

export const publicRoutes = [
  {
    path: "/",
    element: Landing,
    name: "Landing",
  },
  {
    path: "/auth/login",
    element: Login,
    name: "Login",
  },
  {
    path: "/auth/register",
    element: Register,
    name: "Register",
  },
  {
    path: "/assets",
    element: AssetsList,
    name: "Assets",
  },
];

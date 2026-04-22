import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/Router";
import {Toaster} from "react-hot-toast"

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;

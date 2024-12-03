import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/configureStore.js";
const App = lazy(() => import("./App.jsx"));
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const CustomSuspense = ({ children }) => {
  return <Suspense fallback={<h3>Loading...</h3>}>{children}</Suspense>;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <CustomSuspense>
          <App />
        </CustomSuspense>
      }
    >
      <Route
        index={true}
        path="/"
        element={
          <CustomSuspense>
            <LandingPage />
          </CustomSuspense>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer autoClose={1300} />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

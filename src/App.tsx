import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import PublicRoute from "./middlewares/pubic.middleware";
import { store } from "./redux/store";

const HomePage = lazy(() => import('./pages/HomePage'));

export default function App(): React.JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<HomePage />} />
              </Route>
            </Routes>
        </BrowserRouter>
      </Provider>
    );
}
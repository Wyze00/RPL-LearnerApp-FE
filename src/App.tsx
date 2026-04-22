import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import PublicRoute from "./middlewares/pubic.middleware";
import { store } from "./redux/store";
import Header from "./components/Header";

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/public/LoginPage'));

export default function App(): React.JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Header>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Header>
        </BrowserRouter>
      </Provider>
    );
}
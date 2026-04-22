import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import PublicRoute from "./middlewares/pubic.middleware";
import { store } from "./redux/store";
import Header from "./components/Header";

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPassword'));
const ForgotPasswordVerifyPage = lazy(() => import('./pages/public/ForgotPasswordVerify'));

export default function App(): React.JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Header>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/forgot-password/verify" element={<ForgotPasswordVerifyPage />} />
              </Route>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Header>
        </BrowserRouter>
      </Provider>
    );
}
import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import PublicRoute from "./middlewares/pubic.middleware";
import { store } from "./redux/store";
import Header from "./components/Header";

const HomePage = lazy(() => import('./pages/HomePage'));

export default function App(): React.JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Header>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<HomePage />} />
              </Route>
            </Routes>
          </Header>
        </BrowserRouter>
      </Provider>
    );
}
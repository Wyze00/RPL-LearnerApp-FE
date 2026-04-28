import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import PublicRoute from "./middlewares/pubic.middleware";
import { store } from "./redux/store";
import Header from "./components/Header";
import LoginMidleware from "./middlewares/login.middleware";
import AdminMiddleware from "./middlewares/admin.middleware";

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPassword'));
const ForgotPasswordVerifyPage = lazy(() => import('./pages/public/ForgotPasswordVerify'));
const CoursePage = lazy(() => import('./pages/courses/CoursePage'));
const CourseDetailPage = lazy(() => import('./pages/courses/CourseDetailPage'));
const EnrollmentPage = lazy(() => import('./pages/enrollments/EnrollmentPage'));
const EnrollmentDetailPage = lazy(() => import('./pages/enrollments/EnrollmentDetailPage'));
const EnrollmentVideoPage = lazy(() => import('./pages/enrollments/EnrollmentVideoPage'));
const InstructorPage = lazy(() => import('./pages/instructors/InstructorPage'));
const InstructorCoursePage = lazy(() => import('./pages/instructors/InstructorCoursePage'));
const InstructorCourseVideoPage = lazy(() => import('./pages/instructors/InstructorCourseVideoPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const WalletPage = lazy(() => import('./pages/wallet/WalletPage'));

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
              <Route element={<LoginMidleware />}>
                <Route path="/learner/enrollment" element={<EnrollmentPage />} />
                <Route path="/learner/enrollment/:enrollmentId" element={<EnrollmentDetailPage />} />
                <Route path="/learner/enrollment/:enrollmentId/video/:videoId" element={<EnrollmentVideoPage />} />
                <Route path="/instructor" element={<InstructorPage />} />
                <Route path="/instructor/course/:courseId" element={<InstructorCoursePage />} />
                <Route path="/instructor/course/:courseId/video/:videoId" element={<InstructorCourseVideoPage />} />
                <Route path="/wallet" element={<WalletPage />} />
              </Route>
              <Route element={<AdminMiddleware />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
              <Route path="/course" element={<CoursePage />} />
              <Route path="/course/:id" element={<CourseDetailPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Header>
        </BrowserRouter>
      </Provider>
    );
}
import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../hooks/useAppSelector';

export default function AdminMiddleware(): React.JSX.Element {
    const user  = useAppSelector((state) => state.user);
    console.log(user);
    if (!user.username || !user.roles.includes("admin")) {
        return (
            <Navigate to={`/`}/>
        );
    }

    return (
        <Outlet />
    );
}
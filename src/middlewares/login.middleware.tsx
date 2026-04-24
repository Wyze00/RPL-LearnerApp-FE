import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../hooks/useAppSelector';

export default function LoginMidleware(): React.JSX.Element {
    const user  = useAppSelector((state) => state.user);

    if (!user.username) {
        return (
            <Navigate to={`/login`}/>
        );
    }

    return (
        <Outlet />
    );
}
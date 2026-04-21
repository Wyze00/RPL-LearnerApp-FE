import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../hooks/useAppSelector';

export default function PublicRoute(): React.JSX.Element {
    const template  = useAppSelector((state) => state.template);

    if (!template) {
        return (
            <Navigate to={`/`}/>
        );
    }

    return (
        <Outlet />
    );
}
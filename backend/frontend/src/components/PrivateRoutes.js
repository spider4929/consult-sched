import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'


export const PrivateRoutes = () => {
    const initializeState = () => !!JSON.parse(localStorage.getItem("user"));
    const [token, setToken] = useState(initializeState)

    useEffect(() => {
        if (localStorage.getItem("user") === null ) {
            setToken(false);
        } else {
            setToken(true);
        }
    }, []);

    return (
        token ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes;
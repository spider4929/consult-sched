import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'


export const PrivateRoutes = () => {
    const initializeState = () => !!JSON.parse(localStorage.getItem("user"));
    const [token, setToken] = useState(initializeState)

    useEffect(() => {
        if (localStorage.getItem("user") === null ) {
            setToken(false);
            console.log('token set to false')
        } else {
            setToken(true);
            console.log('token set to true')
        }
    }, []);

    return (
        token ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes;
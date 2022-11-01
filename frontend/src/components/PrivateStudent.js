import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'

export const PrivateStudent = () => {
    const token = JSON.parse(localStorage.getItem("user"));
    const [role, setRole] = useState(1)

    useEffect(() => {
        if (token.role != 1){
            setRole(0)
        } else {
            setRole(1)
        }
    }, []);

    return (
        role === 1 ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateStudent;
import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'

export const PrivateTeacher = () => {
    const token = JSON.parse(localStorage.getItem("user"));
    const [role, setRole] = useState(2)

    useEffect(() => {
        if (token.role != 2){
            setRole(0)
        } else {
            setRole(2)
        }
    }, []);

    return (
        role === 2 ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateTeacher;
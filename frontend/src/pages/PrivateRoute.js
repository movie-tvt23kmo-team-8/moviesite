import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { jwtToken } from '../components/Signals';
import { useUser } from '../context/useUser';

export default function PrivateRoute() {
    const  user = jwtToken.value.length !== 0;
    if (!user) {
        return <Navigate to="/login" />
    }
    return <Outlet />
}

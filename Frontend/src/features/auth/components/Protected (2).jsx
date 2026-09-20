import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading, user } = useAuth();

    if (loading) {
        return (<main className="route-loader"><div className="route-loader__spinner" /><p>Loading your workspace…</p></main>);
    }

    if (!user) {
        return <Navigate to={'/login'} replace />;
    }
    
    return children;
}

export default Protected;

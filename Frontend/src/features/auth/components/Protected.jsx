import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading, user } = useAuth();

    // 🔍 Yeh check karne ke liye ki state me kya chal raha hai
    console.log("Protected Route Guard Status -> Loading:", loading, "| User:", user);

    if (loading) {
        return (<main><h1>Loading Workspace...</h1></main>);
    }

    if (!user) {
        return <Navigate to={'/login'} replace />;
    }
    
    return children;
}

export default Protected;
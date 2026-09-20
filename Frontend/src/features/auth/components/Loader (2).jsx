import React from 'react';
import '../../interview/style/loader.scss'; // <-- Linking the style file from interview tree

const Loader = ({ message = "Loading Workspace Dependencies..." }) => {
    return (
        <div className="loader-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0b0e14', color: '#fff' }}>
            <div className="spinner"></div> {/* Aap isko scss se style kar sakte hain */}
            <h1 style={{ marginTop: '1.5rem', fontSize: '1.25rem', color: '#a3b3cc' }}>{message}</h1>
        </div>
    );
};

export default Loader;
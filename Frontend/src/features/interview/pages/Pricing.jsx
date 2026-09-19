import React from 'react';
import '../style/interview.scss'; // Reuse common styles

const Pricing = () => {
    return (
        <div className="pricing-page">
            <h1>Get more with Premium</h1>
            <div className="pricing-card">
                <p>✓ Unlimited AI feedback reports</p>
                <p>✓ Advanced skill gap analysis</p>
                <button className="btn-premium">Upgrade Now</button>
            </div>
        </div>
    );
};
export default Pricing;
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/footer.scss';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="site-footer__container">
                <div className="footer-col">
                    <h4>Product</h4>
                    <Link to="/">Home</Link>
                    <Link to="/tools">Tools</Link>
                    <Link to="/pricing">Pricing</Link>
                    <a href="#">Features</a>
                </div>
                <div className="footer-col">
                    <h4>Resources</h4>
                    <a href="#">Documentation</a>
                    <a href="#">API Access</a>
                    <a href="#">Desktop App</a>
                    <a href="#">Mobile App</a>
                </div>
                <div className="footer-col">
                    <h4>Solutions</h4>
                    <a href="#">For Students</a>
                    <a href="#">For Teams</a>
                    <a href="#">Enterprise</a>
                </div>
                <div className="footer-col">
                    <h4>Legal</h4>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Security</a>
                </div>
                <div className="footer-col">
                    <h4>Company</h4>
                    <a href="#">About us</a>
                    <a href="#">Contact us</a>
                    <a href="#">Blog</a>
                </div>
            </div>

            <div className="site-footer__bottom">
                <span>© {new Date().getFullYear()} WebDev GenAI — All rights reserved.</span>
                <div className="social-icons">
                    <a href="#" aria-label="Twitter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                    <a href="#" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" /></svg>
                    </a>
                    <a href="#" aria-label="GitHub">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
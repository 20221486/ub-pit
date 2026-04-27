import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ubLogo from './logos/ub_logo.png';
import { useAuthStore } from '../storage/useAuthStore';

export default function NavigationBar() {
    const currentUser = useAuthStore(state => state.currentUser);
    const logoutSession = useAuthStore(state => state.logoutSession);
    const navigate = useNavigate();
    function getLinkClass(nav) {
        return nav.isActive ? 'nav-link active' : 'nav-link';
    }

    function handleLogout() {
        logoutSession();
        navigate('/auth');
    }

    return (
        <nav className="NavigationBar">
            <div className="navigation-container">
                <div className="navigation-links-wrapper">
                    <NavLink to="/admin" className={getLinkClass}> Account Panel</NavLink>
                    {['admin', 'product-manager'].includes(currentUser?.role) && (
                        <NavLink to="/management" className={getLinkClass}> Product Management</NavLink>
                    )}
                    {['admin', 'logistics-handler'].includes(currentUser?.role) && (
                        <NavLink to="/return" className={getLinkClass}> Product Return</NavLink>
                    )}
                </div>

                <div className="navigation-icon">
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#e4e4e7', cursor: 'pointer', marginRight: '1rem', fontWeight: 500 }}>Logout</button>
                    <img src={ubLogo} alt="UB" className="ubLogo" />
                </div>
            </div>
        </nav>
    );
}
import React from 'react';
import { NavLink } from 'react-router-dom';
import ubLogo from './logos/ub_logo.png';
export default function NavigationBar() {
    function getLinkClass(nav) {
        return nav.isActive ? 'nav-link active' : 'nav-link';
    }

    return (
        <nav className = "NavigationBar">
            <div className = "navigation-container">
                <div className = "navigation-links-wrapper">
                    <NavLink to = "/admin" className = {getLinkClass}> Admin</NavLink>
                    <NavLink to = "/management" className = {getLinkClass}> Product Management</NavLink>
                    <NavLink to = "/return" className = {getLinkClass}> Product Return</NavLink>
                </div>

                <div className = "navigation-icon">
                    <img src = {ubLogo} alt = "UB" className = "ubLogo" />
                </div>
            </div>
        </nav>
    )
}
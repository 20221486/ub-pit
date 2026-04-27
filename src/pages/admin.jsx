import React, { useState, useEffect } from 'react';
import { useProducts } from '../api/useProducts';
import { useReturns } from '../api/useReturns';
import { useUser } from '../api/useUser';

export default function Admin() {
    const { user, updateUser, isLoading: userLoading } = useUser();
    const { products, isLoading: prodsLoading } = useProducts();
    const { returns, isLoading: returnsLoading } = useReturns();

    const [tempName, setTempName] = useState('');
    const [tempBirth, setTempBirth] = useState('');
    const [tempPass, setTempPass] = useState('');
    const [tempId, setTempId] = useState('');

    useEffect(() => {
        if (user) {
            setTempName(user.name || '');
            setTempBirth(user.birthdate || '');
            setTempPass(user.password || '');
            setTempId(user.idNumber || '');
        }
    }, [user]);

    if (userLoading || prodsLoading || returnsLoading) return <div className="loading-state">Loading dashboard...</div>;

    const totalProds = products.length;
    const activeProds = products.filter(function (p) { return !p.isArchived; }).length;
    const totalReturns = returns.length;

    async function handleProfileUpdate(e) {
        e.preventDefault();
        await updateUser({
            name: tempName,
            birthdate: tempBirth,
            password: tempPass,
            idNumber: tempId
        });
        alert('Profile saved successfully!');
    }

    async function handleToggleRole() {
        const nextRole = user.role === 'admin' ? 'user' : 'admin';
        await updateUser({ role: nextRole });
    }

    return (
        <div>
            <div className="section-header">
                <div><h1 className="section-title">Hello, {user.name}</h1><p className="section-subtitle">ID: {user.idNumber}</p></div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Active Items</div>
                    <div className="stat-value">{activeProds}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Return Logs</div>
                    <div className="stat-value">{totalReturns}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Records</div>
                    <div className="stat-value">{totalProds}</div>
                </div>
            </div>

            <div className="dashboard-layout-stack">
                <section>
                    <div className="section-header">
                        <h2 className="section-title">My Profile</h2>
                        <p className="section-subtitle">Account Settings</p>
                    </div>
                    <div className="content-container content-container-padded">
                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-row form-group-spacer">
                                <div className="form-col">
                                    <label className="label">Name</label>
                                    <input type="text" className="input" value={tempName} onChange={function (e) { setTempName(e.target.value); }} />
                                </div>
                                <div className="form-col">
                                    <label className="label">Email</label>
                                    <input type="text" className="input input-readonly" value={user.email} readOnly />
                                </div>
                            </div>

                            <div className="form-row form-group-spacer">
                                <div className="form-col">
                                    <label className="label">Birthdate</label>
                                    <input type="text" className="input" value={tempBirth} onChange={function (e) { setTempBirth(e.target.value); }} placeholder="12/25/1990" />
                                </div>
                                <div className="form-col">
                                    <label className="label">ID Number</label>
                                    <input type="text" className="input" value={tempId} onChange={function (e) { setTempId(e.target.value); }} placeholder="e.g. 2022-0001" />
                                </div>
                            </div>

                            <div className="form-group-spacer">
                                <label className="label">Password</label>
                                <input type="password" className="input" value={tempPass} onChange={function (e) { setTempPass(e.target.value); }} placeholder="Enter new password" />
                            </div>

                            <button type="submit" className="btn-primary">Save Changes</button>
                        </form>
                    </div>
                </section>

                <section>
                    <div className="section-header">
                        <h2 className="section-title">Role Management</h2>
                        <p className="section-subtitle">Control Permissions</p>
                    </div>
                    <div className="content-container">
                        <div className="user-list">
                            <div className="user-item">
                                <div className="user-info">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-email">{user.email}</span>
                                </div>
                                <div className="user-item-actions">
                                    <span className={`badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                        {user.role}
                                    </span>
                                    <button onClick={handleToggleRole} className="btn-small btn-edit">Change</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

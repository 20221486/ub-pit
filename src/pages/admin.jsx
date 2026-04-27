import React, { useState, useEffect } from 'react';
import { useProducts } from '../api/useProducts';
import { useReturns } from '../api/useReturns';
import { useUsers } from '../api/useUser';
import { useAuthStore } from '../storage/useAuthStore';

export default function Admin() {
    const currentUser = useAuthStore(state => state.currentUser);
    const { users, updateUser, deleteUser, isLoading: usersLoading } = useUsers();
    const { products, isLoading: prodsLoading } = useProducts();
    const { returns, isLoading: returnsLoading } = useReturns();

    const [tempName, setTempName] = useState('');
    const [tempEmail, setTempEmail] = useState('');
    const [tempBirth, setTempBirth] = useState('');
    const [tempPass, setTempPass] = useState('');
    const [tempId, setTempId] = useState('');

    useEffect(() => {
        if (currentUser) {
            setTempName(currentUser.name || '');
            setTempEmail(currentUser.email || '');
            setTempBirth(currentUser.birthdate || '');
            setTempPass(currentUser.password || '');
            setTempId(currentUser.idNumber || '');
        }
    }, [currentUser]);

    if (usersLoading || prodsLoading || returnsLoading || !currentUser) return <div className="loading-state">Loading dashboard...</div>;

    const totalProds = products.length;
    const activeProds = products.filter(function (p) { return !p.isArchived; }).length;
    const totalReturns = returns.length;

    async function handleProfileUpdate(e) {
        e.preventDefault();
        await updateUser({
            id: currentUser.id,
            name: tempName,
            email: tempEmail,
            birthdate: tempBirth,
            password: tempPass,
            idNumber: tempId
        });
        alert('Profile saved successfully!');
    }

    async function handleToggleRole(targetUser) {
        if (targetUser.email === 'admin@example.com') {
            alert('Cannot change the role of the default admin.');
            return;
        }
        const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
        await updateUser({ id: targetUser.id, role: nextRole });
    }

    async function handleDeleteUser(targetUser) {
        if (targetUser.id === currentUser.id) {
            alert('You cannot delete your own account.');
            return;
        }
        if (targetUser.role === 'admin') {
            alert('You cannot delete another admin account.');
            return;
        }
        if (window.confirm(`Are you sure you want to delete ${targetUser.name}'s account?`)) {
            await deleteUser(targetUser.id);
        }
    }

    return (
        <div>
            <div className="section-header">
                <div><h1 className="section-title">Hello, {currentUser.name}</h1><p className="section-subtitle">ID: {currentUser.idNumber}</p></div>
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
                                    <input type="email" className="input" value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} />
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

                {currentUser.role === 'admin' && (
                    <section>
                        <div className="section-header">
                            <h2 className="section-title">User Management</h2>
                            <p className="section-subtitle">Control Permissions & Accounts</p>
                        </div>
                        <div className="content-container">
                            <div className="user-list">
                                {users.map(u => (
                                    <div className="user-item" key={u.id}>
                                        <div className="user-info">
                                            <span className="user-name">{u.name}</span>
                                            <span className="user-email">{u.email}</span>
                                        </div>
                                        <div className="user-item-actions">
                                            <span className={`badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                                {u.role}
                                            </span>
                                            <button onClick={() => handleToggleRole(u)} className="btn-small btn-edit">Change</button>
                                            <button onClick={() => handleDeleteUser(u)} className="btn-small" style={{ backgroundColor: '#f63b3b', color: '#fff', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer', marginLeft: '0.5rem' }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

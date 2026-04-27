import React, { useState, useEffect } from 'react';
import { useProducts } from '../api/useProducts';
import { useReturns } from '../api/useReturns';
import { useUsers } from '../api/useUser';
import { useAuthStore } from '../storage/useAuthStore';

export default function Admin() {
    const currentUser = useAuthStore(state => state.currentUser);
    const { users, updateUser, deleteUser, uploadImage, isLoading: usersLoading } = useUsers();
    const { products, isLoading: prodsLoading } = useProducts();
    const { returns, isLoading: returnsLoading } = useReturns();

    const [tempName, setTempName] = useState('');
    const [tempEmail, setTempEmail] = useState('');
    const [tempBirth, setTempBirth] = useState('');
    const [tempPass, setTempPass] = useState('');
    const [tempId, setTempId] = useState('');
    const [tempImgFile, setTempImgFile] = useState(null);
    const [tempImgUrl, setTempImgUrl] = useState('');

    const [editingRoleUser, setEditingRoleUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        if (currentUser) {
            setTempName(currentUser.name || '');
            setTempEmail(currentUser.email || '');
            setTempBirth(currentUser.birthdate || '');
            setTempPass(currentUser.password || '');
            setTempId(currentUser.idNumber || '');
            setTempImgUrl(currentUser.imageUrl || '');
            setTempImgFile(null);
        }
    }, [currentUser]);

    if (usersLoading || prodsLoading || returnsLoading || !currentUser) return <div className="loading-state">Loading dashboard...</div>;

    const totalProds = products.length;
    const activeProds = products.filter(function (p) { return !p.isArchived; }).length;
    const totalReturns = returns.length;

    async function handleProfileUpdate(e) {
        e.preventDefault();

        let finalImgUrl = tempImgUrl;
        if (tempImgFile) {
            try {
                finalImgUrl = await uploadImage(tempImgFile);
                setTempImgUrl(finalImgUrl);
            } catch (err) {
                alert('Failed to upload image');
                return;
            }
        }

        await updateUser({
            id: currentUser.id,
            name: tempName,
            email: tempEmail,
            birthdate: tempBirth,
            password: tempPass,
            idNumber: tempId,
            imageUrl: finalImgUrl
        });
        alert('Profile saved successfully!');
    }

    async function handleSaveRole() {
        if (!editingRoleUser) return;

        if (editingRoleUser.email === 'admin@example.com' && selectedRole !== 'admin') {
            alert('Cannot change the role of the default admin.');
            setEditingRoleUser(null);
            return;
        }

        await updateUser({ id: editingRoleUser.id, role: selectedRole });
        setEditingRoleUser(null);
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
                            <div className="profile-pic-wrapper">
                                <div className="profile-pic-preview">
                                    {tempImgUrl || (tempImgFile && URL.createObjectURL(tempImgFile)) ? (
                                        <img src={tempImgFile ? URL.createObjectURL(tempImgFile) : tempImgUrl} alt="Profile" className="profile-pic-img" />
                                    ) : (
                                        <span className="profile-pic-icon">👤</span>
                                    )}
                                </div>
                                <div>
                                    <label className="label">Profile Picture</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <input type="file" accept="image/*" onChange={(e) => setTempImgFile(e.target.files[0])} className="input" style={{ flex: 1 }} />
                                        {(tempImgUrl || tempImgFile) && (
                                            <button 
                                                type="button" 
                                                onClick={() => { setTempImgUrl(''); setTempImgFile(null); }} 
                                                className="btn-danger"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

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
                                            <button onClick={() => { setEditingRoleUser(u); setSelectedRole(u.role); }} className="btn-small btn-edit">Change</button>
                                            <button onClick={() => handleDeleteUser(u)} className="btn-danger">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {editingRoleUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Change Role</h3>
                            <button onClick={() => setEditingRoleUser(null)} className="modal-close">&times;</button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-text">Select a new role for <strong>{editingRoleUser.name}</strong></p>
                            <select 
                                value={selectedRole} 
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="input modal-select"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="product-manager">Product Manager</option>
                                <option value="logistics-handler">Logistics Handler</option>
                            </select>
                            <div className="form-actions">
                                <button onClick={() => setEditingRoleUser(null)} className="btn-cancel">Cancel</button>
                                <button onClick={handleSaveRole} className="btn-save">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useState } from 'react';
import { useAuth } from '../api/useAuth';

export default function Auth() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { login, register, isLoggingIn, isRegistering } = useAuth();

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLoginMode) {
                await login({ email, password });
            } else {
                await register({ email, password, name, idNumber, birthdate: '' });
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="section-header">
                <div>
                    <h1 className="section-title">{isLoginMode ? 'Sign In' : 'Create Account'}</h1>
                    <p className="section-subtitle">
                        {isLoginMode ? 'Welcome back to UB PIT' : 'Register a new account'}
                    </p>
                </div>
            </div>

            <div className="content-container content-container-padded">
                <form onSubmit={handleSubmit} className="form-body">
                    {!isLoginMode && (
                        <>
                            <div className="form-group-spacer">
                                <label className="label">Full Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="input" />
                            </div>
                            <div className="form-group-spacer">
                                <label className="label">ID Number</label>
                                <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required placeholder="e.g. 2022-0001" className="input" />
                            </div>
                        </>
                    )}

                    <div className="form-group-spacer">
                        <label className="label">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@s.ubaguio.edu" className="input" />
                    </div>

                    <div className="form-group-spacer">
                        <label className="label">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="input" />
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoggingIn || isRegistering} style={{ width: '100%', marginTop: '1rem' }}>
                        {isLoggingIn || isRegistering ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
                    </button>
                </form>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button 
                    onClick={() => setIsLoginMode(!isLoginMode)} 
                    style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isLoginMode ? "Don't have an account? Register" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
}

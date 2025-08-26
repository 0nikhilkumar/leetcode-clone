import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EyeIcon } from '../components/Icons'; // Adjust path as needed
import { userProfile, deleteProfile } from '../store/authSlice'; // Adjust path to your user slice

// --- Delete Account Modal Component ---
const DeleteAccountModal = ({ isOpen, onClose, onConfirm, loading }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const isConfirmed = confirmationText === 'DELETE';

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (isConfirmed) {
            onConfirm();
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-error">Delete Account</h3>
                <p className="py-4">This action is irreversible. All your data, including profile information, submissions, and solved problems, will be permanently deleted. </p>
                <p>To confirm, please type <strong>DELETE</strong> in the box below.</p>
                
                <div className="form-control w-full my-4">
                    <input 
                        type="text" 
                        placeholder="Type DELETE to confirm" 
                        className={`input input-bordered w-full ${isConfirmed ? 'input-success' : 'input-error'}`}
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                    />
                </div>

                <div className="modal-action">
                    <button onClick={onClose} className="btn btn-ghost" disabled={loading}>Cancel</button>
                    <button 
                        onClick={handleConfirm} 
                        className="btn btn-error" 
                        disabled={!isConfirmed || loading}
                    >
                        {loading && <span className="loading loading-spinner"></span>}
                        Delete My Account
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main Settings Page Component ---

const SettingsPage = ({ setCurrentPage }) => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector(state => state.auth);
    console.log(profile);

    // State for which tab is active
    const [activeTab, setActiveTab] = useState('profile');
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    // State for form inputs, initialized with empty values
    const [formData, setFormData] = useState({
        username: '', realName: '', email: '', bio: '',
        github: '', linkedin: '', website: ''
    });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    // State for password visibility
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);

    // Populate form with user data from Redux store when it's available
    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                bio: profile.bio || '',
                github: profile.github || '',
                linkedin: profile.linkedin || '',
                website: profile.website || '',
            });
        }
    }, [profile]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData };
        // Only include passwords if the new password field is filled
        if (passwords.new && passwords.new === passwords.confirm) {
            payload.password = passwords.new;
            payload.currentPassword = passwords.current;
        }
    };

    const handleDeleteAccount = () => {
        dispatch(deleteProfile());
    };

    return (
        <div data-theme="night" className="p-4 sm:p-6 lg:p-8 bg-base-100 min-h-screen">
            <div className="card bg-base-200 shadow-xl max-w-3xl mx-auto">
                <div className="card-body p-6 sm:p-8">
                    <h2 className="card-title text-3xl mb-4">Settings</h2>
                    
                    <div className="tabs tabs-boxed mb-6 bg-base-300">
                        <a className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</a>
                        <a className={`tab ${activeTab === 'social' ? 'tab-active' : ''}`} onClick={() => setActiveTab('social')}>Social Links</a>
                        <a className={`tab ${activeTab === 'account' ? 'tab-active' : ''}`} onClick={() => setActiveTab('account')}>Account</a>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="min-h-[300px]">
                            {activeTab === 'profile' && (
                                <section>
                                    <h3 className="text-xl font-bold mb-4">Profile Information</h3>
                                    <div className="form-control w-full mb-4">
                                        <label className="label"><span className="label-text">Username</span></label>
                                        <input type="text" name="username" value={formData.username} onChange={handleFormChange} className="input input-bordered w-full" />
                                    </div>
                                    <div className="form-control w-full mb-4">
                                        <label className="label"><span className="label-text">First Name</span></label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} className="input input-bordered w-full" />
                                    </div>
                                    <div className="form-control w-full mb-4">
                                        <label className="label"><span className="label-text">Last Name</span></label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} className="input input-bordered w-full" />
                                    </div>
                                    <div className="form-control w-full mb-4">
                                        <label className="label"><span className="label-text">Bio</span></label>
                                        <textarea name="bio" value={formData.bio} onChange={handleFormChange} className="textarea textarea-bordered h-24" placeholder="Tell us about yourself"></textarea>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'social' && (
                                <section>
                                    <h3 className="text-xl font-bold mb-4">Social Links</h3>
                                    <div className="form-control w-full mb-4">
                                        <label className="label"><span className="label-text">GitHub URL</span></label>
                                        <input type="url" name="github" value={formData.github} onChange={handleFormChange} className="input input-bordered w-full" />
                                    </div>
                                    <div className="form-control w-full mb-4">
                                        <label className="label"><span className="label-text">LinkedIn URL</span></label>
                                        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleFormChange} className="input input-bordered w-full" />
                                    </div>
                                    <div className="form-control w-full mb-4">
                                        <label className="label"><span className="label-text">Portfolio/Website URL</span></label>
                                        <input type="url" name="website" value={formData.website} onChange={handleFormChange} className="input input-bordered w-full" />
                                    </div>
                                </section>
                            )}

                            {activeTab === 'account' && (
                                <section>
                                    <h3 className="text-xl font-bold mb-4">Account Security</h3>
                                    <div className="form-control w-full mb-4">
                                        <label className="label"><span className="label-text">Email Address</span></label>
                                        <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="input input-bordered w-full" />
                                    </div>
                                    <div className="divider">Change Password</div>
                                    <div className="form-control w-full mb-4 relative">
                                        <label className="label"><span className="label-text">Current Password</span></label>
                                        <input type={showCurrentPass ? 'text' : 'password'} name="current" value={passwords.current} onChange={handlePasswordChange} placeholder="••••••••" className="input input-bordered w-full pr-10" />
                                        <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-12 btn btn-ghost btn-sm">
                                            <EyeIcon closed={!showCurrentPass} />
                                        </button>
                                    </div>
                                    <div className="form-control w-full mb-4 relative">
                                        <label className="label"><span className="label-text">New Password</span></label>
                                        <input type={showNewPass ? 'text' : 'password'} name="new" value={passwords.new} onChange={handlePasswordChange} placeholder="••••••••" className="input input-bordered w-full pr-10" />
                                        <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-12 btn btn-ghost btn-sm">
                                            <EyeIcon closed={!showNewPass} />
                                        </button>
                                    </div>
                                    <div className="form-control w-full mb-4">
                                        <label className="label"><span className="label-text">Confirm New Password</span></label>
                                        <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} placeholder="••••••••" className="input input-bordered w-full" />
                                    </div>
                                    <div className="divider">Danger Zone</div>
                                    <div className="p-4 border border-error/50 rounded-lg bg-error/10">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold">Delete Account</h4>
                                                <p className="text-sm text-base-content/70">Permanently delete your account and all associated data.</p>
                                            </div>
                                            <button type="button" onClick={() => setDeleteModalOpen(true)} className="btn btn-error btn-outline">Delete Account</button>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="card-actions justify-end mt-6 border-t border-base-300 pt-6">
                            <button type="button" onClick={() => setCurrentPage('profile')} className="btn btn-ghost" disabled={loading}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading && <span className="loading loading-spinner"></span>}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <DeleteAccountModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                loading={loading}
            />
        </div>
    );
};

export default SettingsPage;

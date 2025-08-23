const SettingsPage = ({ setCurrentPage }) => {
    return (
        <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
            <div className="card-body">
                <h2 className="card-title text-3xl mb-6">Settings</h2>
                
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-control w-full mb-4">
                        <label className="label"><span className="label-text">Username</span></label>
                        <input type="text" placeholder="Username" className="input input-bordered w-full" defaultValue="Username" />
                    </div>
                    <div className="form-control w-full mb-4">
                        <label className="label"><span className="label-text">Email Address</span></label>
                        <input type="email" placeholder="user.email@example.com" className="input input-bordered w-full" defaultValue="user.email@example.com" />
                    </div>
                    <div className="divider">Change Password</div>
                    <div className="form-control w-full mb-4">
                        <label className="label"><span className="label-text">Current Password</span></label>
                        <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
                    </div>
                    <div className="form-control w-full mb-4">
                        <label className="label"><span className="label-text">New Password</span></label>
                        <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
                    </div>

                    <div className="card-actions justify-end mt-6">
                        <button onClick={() => setCurrentPage('home')} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;

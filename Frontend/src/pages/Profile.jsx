const ProfilePage = ({ setCurrentPage }) => {
    return (
        <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
            <div className="card-body items-center text-center">
                <h2 className="card-title text-3xl mb-4">User Profile</h2>
                <div className="avatar mb-4">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src="https://placehold.co/100x100/333/FFF?text=U" alt="User Avatar" />
                    </div>
                </div>
                <p className="text-xl font-bold">Username</p>
                <p className="text-base-content/70 mb-6">user.email@example.com</p>
                
                <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200">
                    <div className="stat">
                        <div className="stat-title">Problems Solved</div>
                        <div className="stat-value text-primary">125</div>
                        <div className="stat-desc">21% of total</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Contest Rating</div>
                        <div className="stat-value text-secondary">1,840</div>
                        <div className="stat-desc">↗︎ 40 (2%)</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Rank</div>
                        <div className="stat-value">#10,432</div>
                    </div>
                </div>

                <div className="card-actions justify-end mt-6">
                    <button onClick={() => setCurrentPage('home')} className="btn btn-ghost">Back to Problems</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

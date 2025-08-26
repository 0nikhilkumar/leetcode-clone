import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Correct import for modern React Router
import { Icon, ICONS } from '../components/Icons'; // Adjust path as needed
import { getAllProblemSolvedByUser } from '../store/problemSlice'; // Adjust path to your slice
import { userProfile } from '../store/authSlice'; // Adjust path to your slice

// --- Sub-Components ---
// These components are self-contained and do not need changes.

const ProfileHeader = ({ user }) => {
    const displayName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="avatar">
                <div className="w-24 rounded-lg shadow-lg flex justify-center items-center bg-gray-800 text-primary-content text-4xl font-bold">
                    <h1>{user?.username?.charAt(0).toUpperCase()}</h1>
                </div>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-base-content">{displayName}</h1>
                <p className="text-base-content/70">@{user?.username}</p>
                <div className="flex items-center gap-4 mt-2">
                    {user?.github && <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-base-content/70 hover:text-primary transition-colors"><Icon path={ICONS.github} /></a>}
                    {user?.linkedin && <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-base-content/70 hover:text-primary transition-colors"><Icon path={ICONS.linkedin} /></a>}
                    {user?.website && <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-base-content/70 hover:text-primary transition-colors"><Icon path={ICONS.leetcode} /></a>}
                </div>
            </div>
        </div>
    );
};

const StatPill = ({ label, value, colorClass }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-base-content/70">{label}</span>
        <span className={`font-semibold ${colorClass}`}>{value}</span>
    </div>
);

const SolvedStats = ({ solvedStats }) => {
    const { easy, medium, hard, totalSolved, totalProblems } = solvedStats;
    const solvedPercentage = totalProblems > 0 ? ((totalSolved / totalProblems) * 100).toFixed(0) : 0;

    return (
        <div className="card bg-base-200 shadow-md">
            <div className="card-body p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-bold">{totalSolved} <span className="text-base font-normal text-base-content/50">/ {totalProblems}</span></h3>
                        <p className="text-base-content/70">Solved Problems</p>
                    </div>
                    <div className="radial-progress text-primary" style={{ "--value": solvedPercentage, "--size": "3.5rem" }}>
                        {solvedPercentage}%
                    </div>
                </div>
                <div className="space-y-2">
                    <StatPill label="Easy" value={`${easy.count} / ${easy.total}`} colorClass="text-success" />
                    <progress className="progress progress-success w-full" value={easy.count} max={easy.total || 1}></progress>
                    <StatPill label="Medium" value={`${medium.count} / ${medium.total}`} colorClass="text-warning" />
                    <progress className="progress progress-warning w-full" value={medium.count} max={medium.total || 1}></progress>
                    <StatPill label="Hard" value={`${hard.count} / ${hard.total}`} colorClass="text-error" />
                    <progress className="progress progress-error w-full" value={hard.count} max={hard.total || 1}></progress>
                </div>
            </div>
        </div>
    );
};

const SkillsSection = ({ skills }) => (
    <div className="card bg-base-200 shadow-md">
        <div className="card-body p-6">
            <h3 className="card-title mb-4">Top Skills</h3>
            <div className="space-y-4">
                {skills && skills.length > 0 ? skills.map(skill => (
                    <div key={skill.name}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-semibold">{skill.name}</span>
                            <span className="text-base-content/70">{skill.solved} / {skill.total}</span>
                        </div>
                        <progress className="progress progress-primary w-full" value={skill.solved} max={skill.total}></progress>
                    </div>
                )) : <p className="text-base-content/70">Solve problems to build up your skills!</p>}
            </div>
        </div>
    </div>
);

const SolvedProblemsList = ({ problems }) => (
    <div className="card bg-base-200 shadow-md">
        <div className="card-body p-6">
            <h3 className="card-title mb-4">Solved Problems</h3>
            <div className="overflow-x-auto max-h-96">
                {problems && problems.length > 0 ? (
                    <table className="table table-sm w-full">
                        <tbody>
                            {problems.map(problem => (
                                <tr key={problem._id} className="hover">
                                    <td><Link to={`/problem/${problem._id}`} className="link link-hover text-base-content">{problem.title}</Link></td>
                                    <td className="text-right capitalize">
                                        {problem.difficulty === 'easy' && <span className="badge badge-success badge-outline">{problem.difficulty}</span>}
                                        {problem.difficulty === 'medium' && <span className="badge badge-warning badge-outline">{problem.difficulty}</span>}
                                        {problem.difficulty === 'hard' && <span className="badge badge-error badge-outline">{problem.difficulty}</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-base-content/70 p-4">No problems solved yet.</p>
                )}
            </div>
        </div>
    </div>
);


// --- Main Profile Page Component (Corrected) ---

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Select specific state needed for logic to avoid unnecessary re-renders
    const { profile, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);
    const { problemsSolvedByUser, loading: problemsLoading } = useSelector((state) => state.problems);

    useEffect(() => {
        // Fetch user data when the component mounts
        dispatch(userProfile());
        dispatch(getAllProblemSolvedByUser());
    }, [dispatch]);

    // This effect handles redirection if the user is not authenticated
    useEffect(() => {
        // We wait until the initial authentication check is complete (!authLoading)
        // If it's done and the user is not authenticated, redirect to login
        if (!authLoading && !isAuthenticated) {
            navigate('/login'); // Adjust '/login' to your actual login page route
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Memoization for stats and skills (no changes needed here)
    const solvedStats = useMemo(() => {
        const stats = {
            easy: { count: 0, total: 200 },
            medium: { count: 0, total: 400 },
            hard: { count: 0, total: 150 },
            totalSolved: 0,
            totalProblems: 750
        };
        if (problemsSolvedByUser) {
            problemsSolvedByUser.forEach(problem => {
                if (problem.difficulty && stats[problem.difficulty]) {
                    stats[problem.difficulty].count++;
                }
            });
            stats.totalSolved = problemsSolvedByUser.length;
        }
        return stats;
    }, [problemsSolvedByUser]);
    
    const skills = useMemo(() => {
        if (!problemsSolvedByUser) return [];
        const tagTotals = { 'array': 100, 'string': 80, 'hash table': 60, 'dynamic programming': 70, 'tree': 90, 'graph': 65 };
        const tagCounts = {};
        problemsSolvedByUser.forEach(problem => {
            problem.tags?.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        return Object.entries(tagCounts)
            .map(([tagName, solvedCount]) => ({
                name: tagName.charAt(0).toUpperCase() + tagName.slice(1),
                solved: solvedCount,
                total: tagTotals[tagName.toLowerCase()] || 50,
            }))
            .sort((a, b) => b.solved - a.solved);
    }, [problemsSolvedByUser]);

    // Combine loading states from both slices
    const isLoading = authLoading || problemsLoading;

    // Show a full-page loading spinner while data is being fetched
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-base-100">
                <span className="loading loading-lg loading-spinner text-primary"></span>
            </div>
        );
    }

    // If loading is done but there's no profile (e.g., due to auth failure and redirection),
    // render nothing to prevent a flash of an empty/broken page.
    if (!profile) {
        return null;
    }

    // Render the full profile page once all checks have passed and data is available
    return (
        <div data-theme="night" className="p-4 sm:p-6 lg:p-8 bg-base-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <ProfileHeader user={profile} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <SolvedStats solvedStats={solvedStats} />
                    </div>
                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <SkillsSection skills={skills} />
                        <SolvedProblemsList problems={problemsSolvedByUser} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
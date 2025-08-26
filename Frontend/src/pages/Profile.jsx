import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, ICONS } from '../components/Icons'; // Adjust path as needed
import { getAllProblemSolvedByUser } from '../store/problemSlice'; // Adjust path to your slice
import { Link } from 'react-router';

// --- Mock User Info (can be replaced with auth state) ---
const userInfo = {
    username: "dev_coder",
    rank: "10,432",
    avatarUrl: "https://placehold.co/100x100/333/FFF?text=D",
    links: {
        github: "https://github.com/username",
        linkedin: "https://linkedin.com/in/username",
        website: "https://portfolio.dev"
    },
};

// --- Sub-Components ---

const ProfileHeader = ({ user }) => (
    <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="avatar">
            <div className="w-24 rounded-lg shadow-lg">
                <img src={user.avatarUrl} alt={`${user.username}'s avatar`} />
            </div>
        </div>
        <div>
            <h1 className="text-3xl font-bold text-base-content">{user.username}</h1>
            <p className="text-base-content/70">Rank {user.rank}</p>
            <div className="flex items-center gap-4 mt-2">
                <a href={user.links.github} target="_blank" rel="noopener noreferrer" className="text-base-content/70 hover:text-primary transition-colors"><Icon path={ICONS.github} /></a>
                <a href={user.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-base-content/70 hover:text-primary transition-colors"><Icon path={ICONS.linkedin} /></a>
                <a href={user.links.website} target="_blank" rel="noopener noreferrer" className="text-base-content/70 hover:text-primary transition-colors"><Icon path={ICONS.leetcode} /></a>
            </div>
        </div>
    </div>
);

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

const StatCard = ({ title, value }) => (
    <div className="card bg-base-200 shadow-md">
        <div className="card-body text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-4xl font-bold text-primary">{value}</p>
        </div>
    </div>
);

// --- Main Profile Page Component ---

const LeetCodeProfilePage = ({ setCurrentPage }) => {
    const dispatch = useDispatch();
    const { problemsSolvedByUser, loading } = useSelector((state) => state.problems);

    useEffect(() => {
        dispatch(getAllProblemSolvedByUser());
    }, [dispatch]);

    // Calculate stats for difficulty levels
    const solvedStats = useMemo(() => {
        const stats = {
            easy: { count: 0, total: 200 }, // Assuming total problems are static for now
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

    // Calculate skills from problem tags
    const skills = useMemo(() => {
        if (!problemsSolvedByUser) return [];

        // In a real app, this would come from an API
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
                total: tagTotals[tagName.toLowerCase()] || 50, // Default total if not in map
            }))
            .sort((a, b) => b.solved - a.solved); // Sort by most solved

    }, [problemsSolvedByUser]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-base-100">
                <span className="loading loading-lg loading-spinner text-primary"></span>
            </div>
        );
    }

    return (
        <div data-theme="night" className="p-4 sm:p-6 lg:p-8 bg-base-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <ProfileHeader user={userInfo} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <SolvedStats solvedStats={solvedStats} />
                        <StatCard title="Total Solved" value={solvedStats.totalSolved} />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <SkillsSection skills={skills} />
                        <SolvedProblemsList problems={problemsSolvedByUser} />
                    </div>
                </div>
                 <div className="text-center mt-8">
                    <button onClick={() => setCurrentPage('home')} className="btn btn-ghost">Back to Problems</button>
                </div>
            </div>
        </div>
    );
};

export default LeetCodeProfilePage;

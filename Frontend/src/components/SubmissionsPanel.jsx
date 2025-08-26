import React from 'react';
import { getStatusBadge } from './uiHelpers';

const SubmissionsPanel = ({ submissions, loading, onViewDetails }) => {
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <span className="loading loading-spinner text-info"></span>
                <p className="ml-4">Loading Submissions...</p>
            </div>
        );
    }
    if (!submissions || submissions.length === 0) {
        return <div className="p-6 text-center">You have no submissions for this problem yet.</div>;
    }
    return (
        <div className="p-4 overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Language</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((sub) => (
                        <tr key={sub._id || sub.id} className="hover">
                            <td>{new Date(sub.createdAt).toLocaleString()}</td>
                            <td>{getStatusBadge(sub.status)}</td>
                            <td>{sub.language}</td>
                            <td>
                                <button className="btn btn-ghost btn-xs" onClick={() => onViewDetails(sub)}>
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubmissionsPanel;
import React from 'react';

export const Icon = ({ path, className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);

export const getStatusBadge = (status) => {
    switch (status) {
        case 'accepted':
            return <span className="badge badge-success">{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
        case 'wrong':
            return <span className="badge badge-error">{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
        case 'time_limit_exceeded':
            return <span className="badge badge-warning">{status.replace(/_/g, ' ')}</span>;
        case 'runtime_error':
            return <span className="badge badge-warning">{status.replace(/_/g, ' ')}</span>;
        case 'compilation_error':
            return <span className="badge badge-warning">{status.replace(/_/g, ' ')}</span>;
        default:
            return <span className="badge badge-ghost">{status}</span>;
    }
};

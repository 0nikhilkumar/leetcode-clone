import React from 'react';
import Editor from '@monaco-editor/react';
import { getStatusBadge } from './uiHelpers';

const SubmissionDetailModal = ({ submission, onClose }) => {
    if (!submission) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-4xl">
                <h3 className="font-bold text-lg mb-4">Submission Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                    <div className="stat bg-base-200 rounded-lg p-2">
                        <div className="stat-title">Status</div>
                        <div className="stat-value text-sm">{getStatusBadge(submission.status)}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-2">
                        <div className="stat-title">Language</div>
                        <div className="stat-value text-sm">{submission.language.charAt(0).toUpperCase() + submission.language.slice(1)}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-2">
                        <div className="stat-title">Time</div>
                        <div className="stat-value text-sm">{submission.runtime || 'N/A'} Sec</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-2">
                        <div className="stat-title">Memory</div>
                        <div className="stat-value text-sm">{submission.memory || 'N/A'} Bytes</div>
                    </div>
                </div>
                <div className="h-80 rounded-lg overflow-hidden border border-base-300">
                    <Editor
                        height="100%"
                        language={submission.language}
                        value={submission.code}
                        theme="vs-dark"
                        options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                    />
                </div>
                <div className="modal-action">
                    <button className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetailModal;
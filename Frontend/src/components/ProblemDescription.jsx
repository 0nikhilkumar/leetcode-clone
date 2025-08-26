import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import SubmissionsPanel from './SubmissionsPanel';
import SubmissionDetailModal from './SubmissionDetailModal';
import { allSubmissionOfProblem } from '../store/problemSlice'; // Adjust this import path as needed

const ProblemDescription = ({ activeTab, setActiveTab }) => {
    const { id: problemId } = useParams();
    const dispatch = useDispatch();
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const { problemById, submissionsLoading, allSubmissions } = useSelector(state => state.problems);

    useEffect(() => {
        if (activeTab === 'submissions') {
            dispatch(allSubmissionOfProblem(problemId));
        }
    }, [activeTab, dispatch, problemId]);

    const handleViewDetails = (submission) => setSelectedSubmission(submission);
    const handleCloseModal = () => setSelectedSubmission(null);

    const renderContent = () => {
        switch (activeTab) {
            case 'submissions':
                return <SubmissionsPanel submissions={allSubmissions} loading={submissionsLoading} onViewDetails={handleViewDetails} />;
            case 'discussion':
                return <div className="p-6 text-center">Discussion feature coming soon!</div>;
            case 'description':
            default:
                return (
                    <>
                        <h1 className="text-2xl font-bold text-base-content mb-3">{problemById?._id.slice(-2) || "1"}. {problemById?.title || "Problem Title"}</h1>
                        <div className="flex items-center gap-4 mb-6"><div className="badge badge-success">{problemById?.difficulty?.charAt(0).toUpperCase() + problemById?.difficulty?.slice(1) || "Easy"}</div></div>
                        <div className="prose max-w-none text-base-content/90">
                            <p>{problemById?.description || "Problem description goes here."}</p>
                            <div className="mt-8">
                                <h3 className="font-bold text-lg">Examples:</h3>
                                <div className="space-y-3 mt-4 text-sm">
                                    {problemById?.visibleTestCases && problemById.visibleTestCases.length > 0 ? (
                                        problemById.visibleTestCases.map((tc, idx) => (
                                            <div key={idx} className="bg-base-300 p-4 rounded-lg mb-2">
                                                <div className="font-mono"><strong>Input:</strong> <code>{tc.input}</code></div>
                                                <div className="font-mono text-success"><strong>Output:</strong> <code>{tc.output}</code></div>
                                                {tc.explanation && <div className="font-mono text-warning"><strong>Explanation:</strong> {tc.explanation}</div>}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-base-300 p-4 rounded-lg font-mono">No examples available.</div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="font-bold text-lg">Constraints:</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
                                    <li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
                                    <li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
                                    <li><strong>Only one valid answer exists.</strong></li>
                                </ul>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="h-full p-6 lg:p-8 overflow-y-auto bg-base-200 rounded-lg shadow-inner hide-scrollbar">
            <div className="tabs tabs-boxed bg-base-300 mb-6">
                <a className={`tab ${activeTab === 'description' ? 'tab-active' : ''}`} onClick={() => setActiveTab('description')}>Description</a>
                <a className={`tab ${activeTab === 'submissions' ? 'tab-active' : ''}`} onClick={() => setActiveTab('submissions')}>Submissions</a>
                <a className={`tab ${activeTab === 'discussion' ? 'tab-active' : ''}`} onClick={() => setActiveTab('discussion')}>Discussion</a>
            </div>
            {renderContent()}
            {selectedSubmission && (
                <SubmissionDetailModal submission={selectedSubmission} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default ProblemDescription;
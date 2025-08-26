import React from 'react';

const TestResultsPanel = ({ results, loading }) => {
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <span className="loading loading-spinner text-info"></span>
                <p className="ml-4">Running test cases...</p>
            </div>
        );
    }
    return (
        <div className="p-4 h-full overflow-auto">
            <h3 className="font-bold mb-4">Test Cases Run:</h3>
            <div className="space-y-4">
                {results && results.length > 0 ? results.map((result, idx) => (
                    <div key={result.id || idx} className="bg-base-300 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold">Case {result.id || idx + 1}</span>
                            {result.status?.description === 'Accepted' ? (
                                <span className="badge badge-success">Accepted</span>
                            ) : (
                                <span className="badge badge-error">Wrong Answer</span>
                            )}
                        </div>
                        <div className="text-sm font-mono">
                            <div><strong>Input:</strong> <code>{result.stdin}</code></div>
                            <div><strong>Expected Output:</strong> <code>{result.expected_output}</code></div>
                            <div><strong>Your Output:</strong> <code>{result.stdout}</code></div>
                            {result.stderr && <div className="text-warning"><strong>Error:</strong> {result.stderr}</div>}
                        </div>
                    </div>
                )) : <div>No test results.</div>}
            </div>
        </div>
    );
}

export default TestResultsPanel;
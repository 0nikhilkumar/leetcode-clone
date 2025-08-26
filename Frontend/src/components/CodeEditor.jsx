import React from 'react';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Editor from '@monaco-editor/react';
import TestResultsPanel from './TestResultsPanel';
import { Icon } from './uiHelpers';

const CodeEditor = ({
    code, onCodeChange, testResults, loading, isSubmitting,
    language, onLanguageChange, fontSize, onFontSizeChange,
    onRun, onResetClick, startCodeList, onSubmit
}) => {
    return (
        <div className="h-full flex flex-col bg-base-200 rounded-lg shadow-inner">
            <div className="navbar bg-base-300 rounded-t-lg px-4 min-h-0 h-14 flex-shrink-0">
                <div className="flex-1">
                    <select className="select select-bordered select-sm w-36" value={language} onChange={onLanguageChange}>
                        {startCodeList && startCodeList.map((code, idx) => (
                            <option key={idx} value={code.value}>{code.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost btn-sm">
                            <Icon path="M12 12a2 2 0 100-4 2 2 0 000 4zm0 2a2 2 0 100 4 2 2 0 000-4zm0-8a2 2 0 100-4 2 2 0 000 4z" />
                            Settings
                        </button>
                        <div tabIndex={0} className="dropdown-content menu p-4 shadow bg-base-100 rounded-box w-52 space-y-2">
                            <label className="form-control w-full max-w-xs">
                                <div className="label"><span className="label-text">Font Size: {fontSize}px</span></div>
                                <input type="range" min={10} max={24} value={fontSize} onChange={onFontSizeChange} className="range range-primary range-xs" />
                            </label>
                        </div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={onResetClick}>
                        <Icon path="M19.75 6.05V4.75a.75.75 0 00-1.5 0V6.05a4.5 4.5 0 10-4.5 4.5h1.2a3 3 0 113.3-2.95zM10.5 12a4.5 4.5 0 104.5-4.5h-1.2a3 3 0 11-3.3 2.95V12z" />
                        Reset
                    </button>
                    <button className="btn btn-neutral btn-sm" onClick={onRun} disabled={loading || isSubmitting}>
                        {loading && <span className="loading loading-spinner text-xs"></span>}
                        Run
                    </button>
                    <button className="btn btn-success btn-sm" onClick={onSubmit} disabled={isSubmitting || loading}>
                        {isSubmitting && <span className="loading loading-spinner text-xs"></span>}
                        Submit
                    </button>
                </div>
            </div>
            <div className="flex-grow min-h-0">
                <Allotment vertical>
                    <Allotment.Pane>
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={(value) => onCodeChange(value || '')}
                            theme="vs-dark"
                            options={{ fontSize, minimap: { enabled: false } }}
                        />
                    </Allotment.Pane>
                    {(loading || testResults.length > 0) && (
                        <Allotment.Pane defaultSize={200} minSize={50}>
                            <TestResultsPanel results={testResults} loading={loading} />
                        </Allotment.Pane>
                    )}
                </Allotment>
            </div>
        </div>
    );
};

export default CodeEditor;
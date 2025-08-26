import React, { useEffect, useState } from 'react';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

// Import your actions from your problemSlice file
import { getUserProblemById, runCode, submitCode } from '../store/problemSlice'; // Adjust this import path as needed

// Import the new components
import ProblemDescription from '../components/ProblemDescription';
import CodeEditor from '../components/CodeEditor';
import { saveEditorState, loadEditorState } from '../components/utils';

const ProblemPage = () => {
    const dispatch = useDispatch();
    const { problemById, loading, editorCode } = useSelector((state) => state.problems);
    const { id } = useParams();

    const [language, setLanguage] = useState('');
    const [code, setCode] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [fontSize, setFontSize] = useState(14);
    const [activeTab, setActiveTab] = useState('description');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const startCodeList = (problemById?.startCode || []).map(code => ({
        ...code,
        value: code.language?.toLowerCase() || '',
        label: code.language || ''
    }));

    useEffect(() => {
        dispatch(getUserProblemById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (problemById?.startCode?.length > 0) {
            const defaultLanguageValue = problemById.startCode[0].language?.toLowerCase() || '';
            const defaultInitialCode = problemById.startCode[0].initialCode || '';
            const data = loadEditorState(id);
            if (!data[defaultLanguageValue] || !data[defaultLanguageValue].code) {
                setLanguage(defaultLanguageValue);
                setCode(defaultInitialCode);
            } else {
                setLanguage(defaultLanguageValue);
                setCode(data[defaultLanguageValue].code);
            }
        }
    }, [problemById, id]);

    // This useEffect handles changes from localStorage after the initial load
    useEffect(() => {
        const data = loadEditorState(id);
        if (language && data[language]) {
            setCode(data[language].code);
        } else {
            const selectedCode = startCodeList.find(c => c.value === language);
            if (selectedCode) {
                setCode(selectedCode.initialCode);
            }
        }
    }, [language, id, startCodeList]);

    useEffect(() => {
        if (code && language) {
            saveEditorState(id, language, code);
        }
    }, [code, language, id]);

    useEffect(() => {
        if (!editorCode) return;
        let results = Array.isArray(editorCode) ? editorCode : [editorCode];
        const visibleTestCases = problemById?.visibleTestCases || [];
        const mappedResults = results.map(res => {
            const match = visibleTestCases.find(tc => tc.input === res.stdin);
            return { ...res, expected_output: match ? match.output : res.expected_output || '' };
        });
        setTestResults(mappedResults);
    }, [editorCode, problemById]);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        // The logic to set code is now handled by the useEffect watching `language`
    };

    const handleRun = async () => {
        setTestResults([]);
        await dispatch(runCode({ problemId: id, code, language }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await dispatch(submitCode({ problemId: id, code, language })).unwrap();
            setActiveTab('submissions');
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        const selected = startCodeList.find(c => c.value === language) || startCodeList[0];
        if (selected) {
            setCode(selected.initialCode);
        }
        setTestResults([]);
    };

    return (
        <div data-theme="night" className="min-h-screen bg-base-100 text-base-content font-sans">
            <main className="p-4 lg:p-6 h-screen flex flex-col">
                <div className="flex-grow min-h-0">
                    <Allotment>
                        <Allotment.Pane minSize={400}>
                            <ProblemDescription activeTab={activeTab} setActiveTab={setActiveTab} />
                        </Allotment.Pane>
                        <Allotment.Pane minSize={400}>
                            <CodeEditor
                                code={code}
                                onCodeChange={setCode}
                                testResults={testResults}
                                loading={loading}
                                isSubmitting={isSubmitting}
                                language={language}
                                onLanguageChange={handleLanguageChange}
                                fontSize={fontSize}
                                onFontSizeChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                                onRun={handleRun}
                                onResetClick={handleReset}
                                startCodeList={startCodeList}
                                onSubmit={handleSubmit}
                            />
                        </Allotment.Pane>
                    </Allotment>
                </div>
            </main>
        </div>
    );
};

export default ProblemPage;
import React, { useEffect, useState, useMemo } from 'react'; // Import useMemo
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

// Import your components and actions
import { getUserProblemById, runCode, submitCode } from '../store/problemSlice';
import { saveEditorState, loadEditorState } from '../components/utils';
import ProblemDescription from '../components/ProblemDescription';
import CodeEditor from '../components/CodeEditor';

// --- NEW HELPER FUNCTION ---
// This function maps language names from your backend to what Monaco Editor expects.
const getMonacoLanguage = (lang) => {
    if (!lang) return '';
    const lowerLang = lang.toLowerCase();

    switch (lowerLang) {
        case 'c++':
        case 'cplusplus':
            return 'cpp'; // Monaco's identifier for C++
        case 'python':
            return 'python';
        case 'java':
            return 'java';
        case 'javascript':
            return 'javascript';
        // Add any other mappings if needed
        default:
            return lowerLang; // Fallback for other languages
    }
};


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

    // --- UPDATED THIS SECTION ---
    const startCodeList = useMemo(() => (problemById?.startCode || []).map(sc => ({
        ...sc,
        // Use the helper function to get the correct language identifier
        value: getMonacoLanguage(sc.language),
        label: sc.language || ''
    })), [problemById]);

    useEffect(() => {
        if (id) {
            dispatch(getUserProblemById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (startCodeList.length > 0 && !language) { // Run only if language isn't set yet
            const defaultLangInfo = startCodeList[0];
            const defaultLangValue = defaultLangInfo.value;
            const defaultInitialCode = defaultLangInfo.initialCode;
            const savedData = loadEditorState(id);
            
            if (savedData[defaultLangValue]?.code) {
                setLanguage(defaultLangValue);
                setCode(savedData[defaultLangValue].code);
            } else {
                setLanguage(defaultLangValue);
                setCode(defaultInitialCode);
            }
        }
    }, [startCodeList, id, language]);

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
        const savedData = loadEditorState(id);

        if (savedData[newLang]?.code) {
            setCode(savedData[newLang].code);
        } else {
            const selectedCodeInfo = startCodeList.find(c => c.value === newLang);
            if (selectedCodeInfo) {
                setCode(selectedCodeInfo.initialCode);
            }
        }
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
import React, { useEffect, useState } from 'react';
import CreateProblemModal from '../components/CreateProblemModel';
import { useDispatch, useSelector } from 'react-redux';
import { allProblems, deleteProblem, getProblemById, updateProblem } from '../store/problemSlice';
import ConfirmationModal from '../components/ConfirmationModal';


const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
        case 'Easy':
            return 'badge-success';
        case 'Medium':
            return 'badge-warning';
        case 'Hard':
            return 'badge-error';
        default:
            return 'badge-ghost';
    }
};

const AdminProblemsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { problems: allProblems2, loading, problemById } = useSelector((state) => state.problems);
    const [editId, setEditId] = useState(null);
    const [editDefaultValues, setEditDefaultValues] = useState(null);
    const dispatch = useDispatch();
    const [problemss, setProblemss] = useState([]);
    const handleAddProblem = (newProblem) => {
        setProblemss([...problemss, newProblem]);
        console.log("New problem added:", newProblem);
    };

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [problemToDelete, setProblemToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteProblem = (id) => {
        setProblemToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setDeleting(true);
        await dispatch(deleteProblem(problemToDelete));
        await dispatch(allProblems());
        setDeleting(false);
        setIsConfirmModalOpen(false);
        setProblemToDelete(null);
    };

    const handleCancelDelete = () => {
        if (!deleting) {
            setIsConfirmModalOpen(false);
            setProblemToDelete(null);
        }
    };

    useEffect(() => {
        setProblemss(allProblems2);
    }, [allProblems2]);

    // When admin clicks edit, fetch problem and open modal
    const handleEditProblem = (id) => {
        setEditId(id);
        dispatch(getProblemById(id));
        setIsModalOpen(true);
    };

    // When problemById changes, set modal default values
    useEffect(() => {
        if (editId && problemById && (problemById._id === editId || problemById.id === editId)) {
            setEditDefaultValues({
                id: problemById._id || problemById.id,
                title: problemById.title || '',
                description: problemById.description || '',
                tags: problemById.tags || [],
                difficulty: problemById.difficulty ? problemById.difficulty.charAt(0).toUpperCase() + problemById.difficulty.slice(1).toLowerCase() : '',
                testCases: {
                    visible: problemById.visibleTestCases || [],
                    hidden: problemById.hiddenTestCases || []
                },
                codeStubs: (problemById.startCode || []).map((stub, i) => ({
                    language: stub.language ? stub.language.toLowerCase() : '',
                    starterCode: stub.initialCode || '',
                    referenceCode: (problemById.referenceSolution && problemById.referenceSolution[i]?.completeCode) || ''
                }))
            });
        }
    }, [editId, problemById]);

    useEffect(() => {
        dispatch(allProblems());
    }, [dispatch]);

    // Helper: open modal for create (blank)
    const handleOpenCreateModal = () => {
        setEditId(null);
        setEditDefaultValues({
            title: '',
            description: '',
            tags: [],
            difficulty: '',
            testCases: { visible: [], hidden: [] },
            codeStubs: []
        });
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold mb-4 sm:mb-0">All LeetCode Problems</h1>
                    <button className="btn btn-primary w-full sm:w-auto" onClick={handleOpenCreateModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Problem
                    </button>
                </header>

                {/* Problems Table */}
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                    <table className="table table-zebra w-full">
                        {/* Table Head */}
                        <thead className="text-sm text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Tags</th>
                                <th className="p-4">Difficulty</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        {
                            loading ? (
                                <tbody>
                                    <tr>
                                        <td colSpan="5" className="text-center py-12">
                                            <span className="loading loading-spinner loading-lg"></span>
                                            <span className="ml-4 text-lg">Loading problems...</span>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {(problemss || []).map((problem, index) => (
                                        <tr key={problem?._id || index} className="hover:bg-gray-700 transition-colors duration-200">
                                            <td className="p-4 font-medium">{index + 1}</td>
                                            <td className="p-4 font-semibold">{problem.title}</td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {problem.tags.map((tag, index) => (
                                                        <span key={index} className="badge badge-outline badge-info text-xs">
                                                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`badge ${getDifficultyClass(problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1))} text-white font-semibold`}>
                                                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button className="btn btn-ghost btn-xs" onClick={() => handleEditProblem(problem._id || problem.id)}>Edit</button>
                                                <button className="btn btn-ghost btn-xs text-red-500" onClick={() => handleDeleteProblem(problem._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )
                        }
                    </table>
                </div>
            </div>
            <CreateProblemModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditId(null); setEditDefaultValues(null); }}
                onAddProblem={handleAddProblem}
                defaultValues={editDefaultValues}
                isEdit={!!editId}
            />
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this problem? This action cannot be undone."
                confirmDisabled={deleting}
                cancelDisabled={deleting}
                confirmButton={deleting ? (
                    <button className="btn btn-error btn-disabled">
                        <span className="loading loading-spinner loading-sm mr-2"></span> Deleting...
                    </button>
                ) : (
                    <button className="btn btn-error">Delete</button>
                )}
            />
        </div>
    );
};

export default AdminProblemsPage;
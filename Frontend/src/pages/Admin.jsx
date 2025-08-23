import React, { useEffect, useState } from 'react';
import CreateProblemModal from '../components/CreateProblemModel';
import { useDispatch, useSelector } from 'react-redux';
import { allProblems } from '../store/problemSlice';

// Mock data for the problems. In a real application, you would fetch this from an API.
const problems = [
    { id: 1, title: "Two Sum", tags: ["Array", "Hash Table"], difficulty: "Easy" },
    { id: 2, title: "Add Two Numbers", tags: ["Linked List", "Math"], difficulty: "Medium" },
    { id: 3, title: "Longest Substring Without Repeating Characters", tags: ["Hash Table", "String", "Sliding Window"], difficulty: "Medium" },
    { id: 4, title: "Median of Two Sorted Arrays", tags: ["Array", "Binary Search", "Divide and Conquer"], difficulty: "Hard" },
    { id: 5, title: "Valid Parentheses", tags: ["String", "Stack"], difficulty: "Easy" },
    { id: 6, title: "Merge K Sorted Lists", tags: ["Linked List", "Heap", "Divide and Conquer"], difficulty: "Hard" },
    { id: 7, title: "3Sum", tags: ["Array", "Two Pointers"], difficulty: "Medium" },
    { id: 8, title: "Container With Most Water", tags: ["Array", "Two Pointers"], difficulty: "Medium" },
    { id: 9, title: "Palindrome Number", tags: ["Math"], difficulty: "Easy" },
    { id: 10, title: "Regular Expression Matching", tags: ["String", "Dynamic Programming", "Recursion"], difficulty: "Hard" },
];

// Helper function to determine the badge color based on difficulty
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
    const { problems: allProblems2, loading } = useSelector((state) => state.problems);
    const dispatch = useDispatch();
    console.log(allProblems2);
    const [problemss, setProblemss] = useState([]);
    const handleAddProblem = (newProblem) => {
        setProblemss([...problemss, newProblem]);
        console.log("New problem added:", newProblem);
    };

    useEffect(() => {
        setProblemss(allProblems2);
    }, [allProblems2]);

    useEffect(() => {
        dispatch(allProblems())
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold mb-4 sm:mb-0">All LeetCode Problems</h1>
                    <button className="btn btn-primary w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
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
                        {/* Table Body */}
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
                                        <tr key={problem._id} className="hover:bg-gray-700 transition-colors duration-200">
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
                                                <button className="btn btn-ghost btn-xs">Edit</button>
                                                <button className="btn btn-ghost btn-xs text-red-500">Delete</button>
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
                onClose={() => setIsModalOpen(false)}
                onAddProblem={handleAddProblem}
            />
        </div>
    );
};

export default AdminProblemsPage;

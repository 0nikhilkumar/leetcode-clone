import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const availableTags = ["Array", "Hash Table", "Linked List", "Math", "String", "Sliding Window", "Binary Search", "Divide and Conquer", "Dynamic Programming", "Heap", "Stack", "Two Pointers", "Graph", "Tree"];

const testCaseSchema = z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
});

const codeStubSchema = z.object({
    language: z.string(),
    starterCode: z.string().min(1, "Starter code is required"),
    referenceCode: z.string().optional(),
});

const problemSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    testCases: z.object({
        visible: z.array(testCaseSchema).min(1, "At least one visible test case is required"),
        hidden: z.array(testCaseSchema).min(1, "At least one hidden test case is required"),
    }),
    codeStubs: z.array(codeStubSchema).min(1, "At least one language stub is required"),
});


// --- CREATE PROBLEM MODAL COMPONENT ---
const CreateProblemModal = ({ isOpen, onClose, onAddProblem }) => {
    const [activeTab, setActiveTab] = useState('Details');
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    const tagDropdownRef = useRef(null);

    const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            title: '',
            description: '',
            tags: [],
            difficulty: 'Easy',
            testCases: { visible: [{ input: '', output: '', explanation: '' }], hidden: [{ input: '', output: '' }] },
            codeStubs: [{ language: 'javascript', starterCode: 'function solve(params) {\n  // Write your code here\n}', referenceCode: '' }]
        }
    });

    const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: "testCases.visible" });
    const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: "testCases.hidden" });
    const { fields: codeFields, append: appendCode, remove: removeCode } = useFieldArray({ control, name: "codeStubs" });

    const selectedTags = watch('tags');

    useEffect(() => {
        function handleClickOutside(event) {
            if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target)) {
                setIsTagDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [tagDropdownRef]);

    const handleTagSelect = (tag) => {
        const currentTags = watch('tags');
        if (!currentTags.includes(tag)) {
            setValue('tags', [...currentTags, tag], { shouldValidate: true });
        }
        setIsTagDropdownOpen(false);
    };

    const handleTagRemove = (tagToRemove) => {
        setValue('tags', watch('tags').filter(tag => tag !== tagToRemove), { shouldValidate: true });
    };

    const processSubmit = (data) => {
        // Transform the form data to the desired output format
        const outputData = {
            title: data.title,
            description: data.description,
            difficulty: data.difficulty.toLowerCase(),
            tags: data.tags.map(tag => tag.toLowerCase()),
            visibleTestCases: data.testCases.visible,
            hiddenTestCases: data.testCases.hidden,
            startCode: data.codeStubs.map(stub => ({
                language: stub.language.charAt(0).toUpperCase() + stub.language.slice(1),
                initialCode: stub.starterCode
            })),
            referenceSolution: data.codeStubs
                .filter(stub => stub.referenceCode) // Only include if reference solution exists
                .map(stub => ({
                    language: stub.language.toLowerCase(),
                    completeCode: stub.referenceCode
                }))
        };

        console.log("Formatted Output Data:", outputData);
        onAddProblem({ ...outputData, id: Date.now() });
        onClose();
    };

    const onFormError = (errs) => {
        console.error("Form validation failed:", errs);
        if (errs.title || errs.description || errs.tags || errs.difficulty) {
            setActiveTab('Details');
        } else if (errs.testCases) {
            setActiveTab('TestCases');
        } else if (errs.codeStubs) {
            setActiveTab('Code');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <form onSubmit={handleSubmit(processSubmit, onFormError)} className="modal-box w-11/12 max-w-5xl bg-gray-800 text-white">
                <h3 className="font-bold text-2xl mb-4">Create New Problem</h3>

                <div className="tabs tabs-boxed mb-6 bg-gray-900">
                    <a className={`tab ${activeTab === 'Details' ? 'tab-active' : ''}`} onClick={() => setActiveTab('Details')}>Details</a>
                    <a className={`tab ${activeTab === 'TestCases' ? 'tab-active' : ''}`} onClick={() => setActiveTab('TestCases')}>Test Cases</a>
                    <a className={`tab ${activeTab === 'Code' ? 'tab-active' : ''}`} onClick={() => setActiveTab('Code')}>Code</a>
                </div>

                <div className="form-control space-y-6">
                    {activeTab === 'Details' && (
                        <>
                            <div>
                                <input type="text" placeholder="Problem Title" className={`input input-bordered w-full bg-gray-700 ${errors.title ? 'input-error' : ''}`} {...register("title")} />
                                {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
                            </div>
                            <div>
                                <textarea className={`textarea textarea-bordered h-32 w-full bg-gray-700 ${errors.description ? 'textarea-error' : ''}`} placeholder="Problem Description (supports Markdown)" {...register("description")}></textarea>
                                {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative" ref={tagDropdownRef}>
                                    <label className="label"><span className="label-text text-gray-400">Tags</span></label>
                                    <div onClick={() => setIsTagDropdownOpen(true)} className={`input input-bordered w-full bg-gray-700 flex items-center flex-wrap gap-2 min-h-12 cursor-pointer ${errors.tags ? 'input-error' : ''}`}>
                                        {selectedTags.map(tag => (
                                            <div key={tag} className="badge badge-info gap-2">
                                                <span>{tag}</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); handleTagRemove(tag); }} className="btn btn-xs btn-circle btn-ghost"><XIcon /></button>
                                            </div>
                                        ))}
                                        {selectedTags.length === 0 && <span className="text-gray-500">Select tags...</span>}
                                    </div>
                                    {isTagDropdownOpen && (
                                        <ul className="absolute z-10 w-full mt-1 bg-gray-600 shadow-lg rounded-md max-h-60 overflow-y-auto">
                                            {availableTags.filter(t => !selectedTags.includes(t)).map(tag => (
                                                <li key={tag} onClick={() => handleTagSelect(tag)} className="px-4 py-2 hover:bg-gray-700 cursor-pointer">{tag}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {errors.tags && <p className="text-error text-xs mt-1">{errors.tags.message}</p>}
                                </div>
                                <div>
                                    <label className="label"><span className="label-text text-gray-400">Difficulty</span></label>
                                    <select className="select select-bordered w-full bg-gray-700" {...register("difficulty")}>
                                        <option>Easy</option><option>Medium</option><option>Hard</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'TestCases' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold mb-2">Visible Test Cases</h4>
                                {errors.testCases?.visible && <p className="text-error text-xs mb-2">{errors.testCases.visible.message || errors.testCases.visible.root?.message}</p>}
                                <div className="space-y-3 max-h-72 overflow-y-auto p-2 bg-gray-900 rounded-md">
                                    {visibleFields.map((field, index) => (
                                        <div key={field.id} className="bg-gray-700 p-3 rounded-lg relative">
                                            <button type="button" className="btn btn-xs btn-circle btn-error absolute top-2 right-2" onClick={() => removeVisible(index)}><XIcon /></button>
                                            <textarea placeholder="Input" className={`textarea textarea-sm w-full bg-gray-600 font-mono ${errors.testCases?.visible?.[index]?.input ? 'textarea-error' : ''}`} {...register(`testCases.visible.${index}.input`)} rows="2"></textarea>
                                            {errors.testCases?.visible?.[index]?.input && <p className="text-error text-xs mt-1">{errors.testCases.visible[index].input.message}</p>}
                                            <textarea placeholder="Expected Output" className={`textarea textarea-sm w-full bg-gray-600 font-mono mt-2 ${errors.testCases?.visible?.[index]?.output ? 'textarea-error' : ''}`} {...register(`testCases.visible.${index}.output`)} rows="2"></textarea>
                                            {errors.testCases?.visible?.[index]?.output && <p className="text-error text-xs mt-1">{errors.testCases.visible[index].output.message}</p>}
                                            <textarea placeholder="Explanation (Optional)" className="textarea textarea-sm w-full bg-gray-600 font-mono mt-2" {...register(`testCases.visible.${index}.explanation`)} rows="1"></textarea>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="btn btn-sm btn-outline btn-info mt-3" onClick={() => appendVisible({ input: '', output: '', explanation: '' })}>Add Visible Case</button>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-2">Hidden Test Cases</h4>
                                {errors.testCases?.hidden && <p className="text-error text-xs mb-2">{errors.testCases.hidden.message || errors.testCases.hidden.root?.message}</p>}
                                <div className="space-y-3 max-h-72 overflow-y-auto p-2 bg-gray-900 rounded-md">
                                    {hiddenFields.map((field, index) => (
                                        <div key={field.id} className="bg-gray-700 p-3 rounded-lg relative">
                                            <button type="button" className="btn btn-xs btn-circle btn-error absolute top-2 right-2" onClick={() => removeHidden(index)}><XIcon /></button>
                                            <textarea placeholder="Input" className={`textarea textarea-sm w-full bg-gray-600 font-mono ${errors.testCases?.hidden?.[index]?.input ? 'textarea-error' : ''}`} {...register(`testCases.hidden.${index}.input`)} rows="2"></textarea>
                                            {errors.testCases?.hidden?.[index]?.input && <p className="text-error text-xs mt-1">{errors.testCases.hidden[index].input.message}</p>}
                                            <textarea placeholder="Expected Output" className={`textarea textarea-sm w-full bg-gray-600 font-mono mt-2 ${errors.testCases?.hidden?.[index]?.output ? 'textarea-error' : ''}`} {...register(`testCases.hidden.${index}.output`)} rows="2"></textarea>
                                            {errors.testCases?.hidden?.[index]?.output && <p className="text-error text-xs mt-1">{errors.testCases.hidden[index].output.message}</p>}
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="btn btn-sm btn-outline btn-info mt-3" onClick={() => appendHidden({ input: '', output: '' })}>Add Hidden Case</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Code' && (
                        <div>
                            {errors.codeStubs && <p className="text-error text-xs mb-2">{errors.codeStubs.message || errors.codeStubs.root?.message}</p>}
                            <div className="space-y-4 max-h-80 overflow-y-auto p-2">
                                {codeFields.map((field, index) => (
                                    <div key={field.id} className="p-4 bg-gray-900 rounded-md">
                                        <div className="flex justify-between items-center mb-3">
                                            <select {...register(`codeStubs.${index}.language`)} className="select select-sm bg-gray-700">
                                                <option value="javascript">JavaScript</option>
                                                <option value="python">Python</option>
                                                <option value="java">Java</option>
                                                <option value="cpp">C++</option>
                                            </select>
                                            <button type="button" className="btn btn-sm btn-error btn-outline" onClick={() => removeCode(index)}>Remove</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="label"><span className="label-text text-gray-400">Starter Code</span></label>
                                                <textarea className={`textarea textarea-bordered w-full h-40 bg-gray-700 font-mono text-sm ${errors.codeStubs?.[index]?.starterCode ? 'textarea-error' : ''}`} {...register(`codeStubs.${index}.starterCode`)}></textarea>
                                                {errors.codeStubs?.[index]?.starterCode && <p className="text-error text-xs mt-1">{errors.codeStubs[index].starterCode.message}</p>}
                                            </div>
                                            <div>
                                                <label className="label"><span className="label-text text-gray-400">Reference Solution</span></label>
                                                <textarea className="textarea textarea-bordered w-full h-40 bg-gray-700 font-mono text-sm" {...register(`codeStubs.${index}.referenceCode`)}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="btn btn-sm btn-outline btn-info mt-3" onClick={() => appendCode({ language: 'java', starterCode: 'class Solution {\n    public void solve() {\n        // Write your code here\n    }\n}', referenceCode: '' })}>Add Language</button>
                        </div>
                    )}
                </div>

                <div className="modal-action mt-8">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Problem</button>
                </div>
            </form>
        </div>
    );
};

export default CreateProblemModal;
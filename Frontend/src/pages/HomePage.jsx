import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allProblems } from '../store/problemSlice';
import { useNavigate } from 'react-router';

// Mock data simulating problems fetched from a backend
const mockProblems = [
  { _id: 1, title: "Two Sum", tags: ["Array", "Hash Table"], difficulty: "Easy" },
  { _id: 2, title: "Add Two Numbers", tags: ["Linked List", "Math"], difficulty: "Medium" },
  { _id: 3, title: "Longest Substring Without Repeating Characters", tags: ["Hash Table", "String", "Sliding Window"], difficulty: "Medium" },
  { _id: 4, title: "Median of Two Sorted Arrays", tags: ["Array", "Binary Search", "Divide and Conquer"], difficulty: "Hard" },
  { _id: 5, title: "Longest Palindromic Substring", tags: ["String", "Dynamic Programming"], difficulty: "Medium" },
  { _id: 6, title: "Zigzag Conversion", tags: ["String"], difficulty: "Medium" },
  { _id: 7, title: "Reverse Integer", tags: ["Math"], difficulty: "Easy" },
  { _id: 8, title: "String to Integer (atoi)", tags: ["String", "Math"], difficulty: "Medium" },
  { _id: 9, title: "Palindrome Number", tags: ["Math"], difficulty: "Easy" },
  { _id: 10, title: "Regular Expression Matching", tags: ["String", "Dynamic Programming", "Recursion"], difficulty: "Hard" },
  { _id: 11, title: "Container With Most Water", tags: ["Array", "Two Pointers"], difficulty: "Medium" },
  { _id: 12, title: "Integer to Roman", tags: ["Hash Table", "Math", "String"], difficulty: "Medium" },
];


const getDifficultyClass = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 'badge-success';
    case 'Medium': return 'badge-warning';
    case 'Hard': return 'badge-error';
    default: return 'badge-ghost';
  }
};

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 opacity-50">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// Added ChevronIcon for the expandable tags section
const ChevronIcon = ({ isExpanded }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-chevron-down transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
  </svg>
);

function HomePage() {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  // Added state for the expandable tags section
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { problems: allProblem2, loading } = useSelector(state => state.problems);
  const { user } = useSelector(state => state.auth);
  console.log(user);

  const allTags = useMemo(() => {
    const tagsSet = new Set();
    // Use allProblem2 (from Redux) if available, otherwise fallback to mockProblems
    const sourceProblems = allProblem2 && allProblem2.length > 0 ? allProblem2 : mockProblems;
    sourceProblems.forEach(p => p.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [allProblem2]);

  useEffect(() => {
    setProblems(allProblem2 || []);
  }, [allProblem2]);

  useEffect(() => {
    dispatch(allProblems({}));
  }, [dispatch]);

  const handleApplyFilters = () => {
    const query = {};
    if (selectedDifficulty) query.difficulty = selectedDifficulty.toLowerCase();
    if (selectedTags.length > 0) query.tags = selectedTags.map(tag => tag.toLowerCase()).join(",");
    dispatch(allProblems(query));
  };

  const handleRemoveFilters = () => {
    setSelectedDifficulty("");
    setSelectedTags([]);
    setSearchQuery("");
    dispatch(allProblems({}));
  };

  const handleTagChange = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredProblems = useMemo(() => {
    if (!searchQuery) {
      return problems;
    }
    return problems.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, problems]);

  return (
    <div data-theme="dark" className="min-h-screen bg-base-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-8 text-start">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-2">Problemset</h1>
          <p className="text-base-content/70">Search, filter, and solve.</p>
        </header>

        {/* --- New Layout with Sidebar and Main Content --- */}
        <div className="flex flex-col md:flex-row gap-8">

          {/* --- Sidebar for Filters --- */}
          <aside className="w-full md:w-72 lg:w-80 flex-shrink-0">
            <div className="card bg-base-100 shadow-xl p-4 sm:p-6 space-y-6 sticky top-8">

              {/* Search by Title */}
              <div className="form-control">
                <label className="label"><span className="label-text">Search by Title</span></label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., Two Sum"
                    className="input input-bordered w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="form-control">
                <label className="label"><span className="label-text">Difficulty</span></label>
                <select
                  className="select select-bordered"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Tags Filter (Expandable) */}
              <div className="form-control">
                <label className="label"><span className="label-text">Tags</span></label>
                <button
                  onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                  className="btn btn-bordered w-full justify-between font-normal"
                >
                  <span>{selectedTags.length === 0 ? "Select Tags" : `${selectedTags.length} selected`}</span>
                  <ChevronIcon isExpanded={isTagsExpanded} />
                </button>
                {isTagsExpanded && (
                  <ul className="menu p-2 mt-2 bg-base-200 rounded-box w-full max-h-60 overflow-y-auto">
                    {allTags.map(tag => (
                      <li key={tag}>
                        <label className="label cursor-pointer justify-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagChange(tag)}
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text">{tag}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  className="btn btn-primary"
                  onClick={handleApplyFilters}
                  disabled={!selectedDifficulty && selectedTags.length === 0}
                >
                  Apply Filters
                </button>
                <button
                  className="btn btn-outline"
                  disabled={!selectedDifficulty && selectedTags.length === 0}
                  onClick={handleRemoveFilters}
                >
                  Remove Filters
                </button>
              </div>
            </div>
          </aside>

          {/* --- Main Content: Problems Table --- */}
          <main className='flex-1'>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <span className="loading loading-spinner loading-lg"></span>
                <span className="ml-4 text-lg">Loading problems...</span>
              </div>
            ) : (
              <div className="overflow-x-auto card bg-base-100 shadow-xl">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-base-300">
                      <th className="p-4">#</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Tags</th>
                      <th className="p-4">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.length > 0 ? (
                      filteredProblems.map((problem, index) => (
                        <tr key={problem._id || problem.id} className="hover">
                          <td className="p-4 font-medium">{index + 1}</td>
                          <td className="p-4 font-semibold text-primary-content hover:text-primary transition-colors cursor-pointer" onClick={()=> user.role === 'admin' ? null : navigate(`/problem/${problem._id}`)}>
                            {problem.title}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {problem.tags.map(tag => (
                                <div key={tag} className="badge badge-outline">
                                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`badge ${getDifficultyClass(problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1))} text-white`}>
                              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center p-8">
                          No problems found for your search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const User = require("../models/user.model");
const { getLanguageId, submitBatch, submitToken } = require("../utils/ProblemUtils");

const createProblem = async (req, res) => {
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution } = req.body;
    try {
        for(const {language, completeCode} of referenceSolution) {
            const languageId = getLanguageId(language);

            const submissions = visibleTestCases.map(({input, output}) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }));


            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult?.map((value) => value.token);

            const testResult = await submitToken(resultToken);

            for(const test of testResult) {
                if(test.status_id!=3) {
                    return res.status(400).send("Error Occurred");
                }
            }
        }

        await Problem.create({
            ...req.body,
            problemCreator: req.user._id
        });

        return res.status(201).json({ message: "Problem saved successfully" });
    } catch (error) {
        console.error("Error creating problem:", error);
        res.status(500).json({ message: "Internal server error" });

    }
};

const updateProblem = async (req, res) => {

    const { id } = req.params;
    
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body;

    try {
        
        if(!id) {
            return res.status(400).send("Problem ID is required");
        }

        const problem = await Problem.findById(id);
        if(!problem) {
            return res.status(404).send("Problem not found");
        }

        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageId(language);

            const submissions = visibleTestCases.map(({ input, output }) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }));


            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult?.map((value) => value.token);

            const testResult = await submitToken(resultToken);

            for (const test of testResult) {
                if (test.status_id != 3) {
                    return res.status(400).send("Error Occurred");
                }
            }
        }

        const updatedProblems = await Problem.findByIdAndUpdate(id, {
            ...req.body
        }, {runValidators: true, new: true});

        return res.status(200).send(updatedProblems);
    } catch (error) {
        console.error("Error updating problem:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteProblem = async (req, res) => {
    const { id } = req.params;
    
    try {
        if(!id) return res.status(400).send("Problem ID is required");

        const deletedProblem = await Problem.findByIdAndDelete(id);
        if(!deletedProblem) return res.status(404).send("Problem not found");

        return res.status(200).send("Problem deleted successfully");
    } catch (error) {
        console.error("Error deleting problem:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllProblems = async (req, res) => {
    const {page = 1, limit = 10, difficulty, tags} = req.query;
    try {
        const problems = await Problem.find({
            ...(difficulty && { difficulty }),
            ...(tags && { tags: { $in: tags.split(",") } })
        })
            .skip((page - 1) * limit)
            .limit(limit);
        return res.status(200).json(problems);
    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getProblemById = async (req, res) => {
    const { id } = req.params;

    try {
        if(!id) return res.status(400).send("Problem ID is required");

        const problem = await Problem.findById(id);

        if(!problem) return res.status(404).send("Problem not found");

        return res.status(200).json(problem);
    } catch (error) {
        console.error("Error fetching problem:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllUserSolvedProblems = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate({
            path: "problemSolved",
            select: "_id title difficulty tags"
        });
        return res.status(200).json(user.problemSolved);
    } catch (error) {
        console.error("Error fetching user's solved problems:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const submittedProblem = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id;

        const submissions = await Submission.find({ userId, problemId });
        if(submissions.length === 0) {
            return res.status(404).send("No Submissions found");
        }

        return res.status(200).send(submissions);
    } catch (error) {
        console.error("Error fetching submitted problem:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    createProblem,
    getAllProblems,
    getProblemById,
    updateProblem,
    deleteProblem,
    getAllUserSolvedProblems,
    submittedProblem
};
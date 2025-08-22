const Submission = require("../models/submission.model");
const Problem = require("../models/problem.model");
const { getLanguageId, submitBatch, submitToken } = require("../utils/ProblemUtils");

const submitCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id;
    
        const {code, language} = req.body;
        if(!userId || !problemId || !code || !language) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const problem = await Problem.findById(problemId);
        if(!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        const submissionResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasesPassed: 0,
            status: 'pending',
            testCasesTotal: problem.hiddenTestCases.length
        });

        const languageId = getLanguageId(language);

        const submissions = problem.hiddenTestCases.map(({ input, output }) => ({
            source_code: code,
            language_id: languageId,
            stdin: input,
            expected_output: output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult?.map((value) => value.token);

        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;

        for(const test of testResult) {
            if(test.status_id === 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory += Math.max(memory, test.memory);
            }
            else {
                if(test.status_id === 4) {
                    status = 'wrong';
                    errorMessage = test.stderr;
                }
                else if(test.status_id === 5) {
                    status = 'time_limit_exceeded';
                    errorMessage = test.stderr;
                }
                else if(test.status_id === 6) {
                    status = 'compilation_error';
                    errorMessage = test.stderr;
                }
                else {
                    status = 'runtime_error';
                    errorMessage = test.stderr;
                }
            }
        }

        submissionResult.status = status;
        submissionResult.runtime = runtime;
        submissionResult.memory = memory;
        submissionResult.errorMessage = errorMessage;
        submissionResult.testCasesPassed = testCasesPassed;

        await submissionResult.save();

        if(!req.user.problemSolved.includes(problemId)) {
            req.user.problemSolved.push(problemId);
            await req.user.save();
        }

        return res.status(200).send(submissionResult);

    } catch (error) {
        console.error("Error submitting code:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const runCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id;
    
        const {code, language} = req.body;
        if(!userId || !problemId || !code || !language) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const problem = await Problem.findById(problemId);
        if(!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        const languageId = getLanguageId(language);

        const submissions = problem.visibleTestCases.map(({ input, output }) => ({
            source_code: code,
            language_id: languageId,
            stdin: input,
            expected_output: output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult?.map((value) => value.token);

        const testResult = await submitToken(resultToken);

        return res.status(200).send(testResult);

    } catch (error) {
        console.error("Error submitting code:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    submitCode,
    runCode,
};
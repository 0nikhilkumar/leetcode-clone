const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },
    tags: {
        type: [{
            type: String,
            enum: ["array", "string", "linked list", "tree", "graph", "dynamic programming", "greedy", "backtracking"],
            required: true,
        }],
        required: true
    },
    visibleTestCases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            },
            explanation: {
                type: String,
                required: true,
            }
        }
    ],
    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            },
        }
    ],
    startCode: [
        {
            language: {
                type: String,
                required: true
            },
            initialCode: {
                type: String,
                required: true
            }
        }
    ],
    referenceSolution: [
        {
            language: {
                type: String,
                required: true
            },
            completeCode: {
                type: String,
                required: true
            }
        },
    ],
    problemCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {timestamps: true});

const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;
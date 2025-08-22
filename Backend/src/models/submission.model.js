const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['javascript', 'c++', 'java']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'wrong', 'time_limit_exceeded', 'runtime_error', 'compilation_error'],
        default: 'pending'
    },
    runtime: {
        type: Number, // milliseconds
        default: 0
    },
    memory: {
        type: Number, // MB
        default: 0
    },
    errorMessage: {
        type: String,
        default: ''
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    testCasesTotal: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

submissionSchema.index({userId: 1, problemId: 1}, {unique: true});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
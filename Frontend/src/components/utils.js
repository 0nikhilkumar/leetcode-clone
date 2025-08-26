import React from 'react';

// Local Storage Helpers
const EXPIRY_MS = 3 * 24 * 60 * 60 * 1000;

export function saveEditorState(problemId, language, code) {
    const key = `problem_${problemId}_editor_multi`;
    let data = {};
    try { data = JSON.parse(localStorage.getItem(key)) || {}; } catch { }
    data[language] = { code, ts: Date.now() };
    localStorage.setItem(key, JSON.stringify(data));
}

export function loadEditorState(problemId) {
    const key = `problem_${problemId}_editor_multi`;
    let data = {};
    try { data = JSON.parse(localStorage.getItem(key)) || {}; } catch { }
    const now = Date.now();
    Object.keys(data).forEach(lang => {
        if (!data[lang] || now - data[lang].ts > EXPIRY_MS) {
            delete data[lang];
        }
    });
    localStorage.setItem(key, JSON.stringify(data));
    return data;
}
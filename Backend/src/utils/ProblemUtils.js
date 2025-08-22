const axios = require('axios');

const getLanguageId = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63
    }

    return language[lang.toLowerCase()];
};

const waiting = async (timer) => {
    setTimeout(()=> {
        return 1;
    }, timer);
};

const submitBatch = async (submissions) => {
    const options = {
        method: 'POST',
        url: process.env.JUDGE0_API_URL,
        params: {
            base64_encoded: 'false'
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_API_KEY,
            'x-rapidapi-host': process.env.JUDGE0_API_HOST,
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return await fetchData();
};

const submitToken = async (resultToken) => {
    const options = {
        method: 'GET',
        url: process.env.JUDGE0_API_URL,
        params: {
            tokens: resultToken.join(','),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_API_KEY,
            'x-rapidapi-host': process.env.JUDGE0_API_HOST
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    
    while (true) {
        const result = await fetchData();
        const obtainedResult = result.submissions.every((r) => r.status_id > 2);

        if (obtainedResult) return result.submissions;

        await waiting(1000);
    }
};


module.exports = {
    getLanguageId,
    submitBatch,
    submitToken,
}



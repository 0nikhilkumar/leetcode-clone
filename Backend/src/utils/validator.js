const validator = require("validator");

const validate = (data) => {
    const mandatoryFields = ["email", "password", "firstName"];
    const isAllowed = mandatoryFields.every(k => Object.keys(data).includes(k));

    if(!isAllowed) {
        throw new Error("Missing mandatory fields");
    }

    if(validator.isEmpty(data.email) || !validator.isEmail(data.email)) throw new Error("Invalid email");
    if(!validator.isStrongPassword(data.password)) throw new Error("Weak password");

    return true;
};

module.exports = validate;
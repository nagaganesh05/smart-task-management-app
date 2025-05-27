
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const validateUsername = (username) => {
    return username.length >= 3;
};

const validateTaskName = (name) => {
    return name.trim().length > 0;
};

const validateDueDate = (dateString) => {
    if (!dateString) return true; 
    return !isNaN(new Date(dateString));
};

export { validateEmail, validatePassword, validateUsername, validateTaskName, validateDueDate };
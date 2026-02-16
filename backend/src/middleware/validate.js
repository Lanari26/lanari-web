const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateRequired = (fields) => {
    return (req, res, next) => {
        const missing = fields.filter(f => !req.body[f] || String(req.body[f]).trim() === '');
        if (missing.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missing.join(', ')}`
            });
        }
        next();
    };
};

const validateRegistration = (req, res, next) => {
    const { fullName, email, password, confirmPassword } = req.body;
    const errors = [];

    if (!fullName || fullName.trim().length < 2) errors.push('Full name must be at least 2 characters');
    if (!email || !validateEmail(email)) errors.push('Valid email is required');
    if (!password || password.length < 8) errors.push('Password must be at least 8 characters');
    if (password !== confirmPassword) errors.push('Passwords do not match');

    if (errors.length > 0) {
        return res.status(400).json({ error: errors[0], errors });
    }
    next();
};

module.exports = { validateEmail, validateRequired, validateRegistration };

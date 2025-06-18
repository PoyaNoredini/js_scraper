module.exports = fn => {
    return (req, res, next) => {
        // Fix: Remove the () after next
        fn(req, res, next).catch(next);
    };
};
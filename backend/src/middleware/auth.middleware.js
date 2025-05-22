const authMiddleware = (req, res, next) => {
    // Ví dụ: Kiểm tra header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Thêm logic xác thực JWT ở đây
    next();
};

module.exports = authMiddleware;
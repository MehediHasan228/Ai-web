const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'savora_secret');

            // Get user from the token
            req.user = await prisma.user.findUnique({
                where: { id: parseInt(decoded.id) },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role?.toLowerCase() === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const isManager = (req, res, next) => {
    const role = req.user?.role?.toLowerCase();
    if (req.user && (role === 'admin' || role === 'manager')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a manager or admin' });
    }
};

module.exports = { protect, isAdmin, isManager };

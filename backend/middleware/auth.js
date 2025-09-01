import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const protect = async (req, res, next) => {
    try {
        // Get token from authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: "Not authorized - No token provided" 
            });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Not authorized - Invalid token format" 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded?.id) {
            return res.status(401).json({ 
                success: false, 
                message: "Not authorized - Invalid token" 
            });
        }

        // Find user by ID
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Not authorized - User not found" 
            });
        }

        // Attach user to request object
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: "Not authorized - Invalid token" 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Not authorized - Token expired" 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

// Role-based authorization middleware
export const authorizeRole = (allowedRoles = []) => {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized' });
            }
            if (rolesArray.length > 0 && !rolesArray.includes(req.user.role)) {
                return res.status(403).json({ success: false, message: 'Forbidden - Insufficient role' });
            }
            next();
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    };
}
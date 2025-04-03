import jwt from "jsonwebtoken";

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ message: "Unauthorized" , success: false});

        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid" , success: false});
        }
        req.id = decoded.userId; // Attach user ID to request object
       // req.user = decoded.user; // Attach user object to request object
        next(); // Call the next middleware or route handler
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(401).json({success: false, message: "not authenticated"  })
        }
        const { userId } = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = userId
        next()
    } catch (error) {
        res.status(401).json({success: false, message: "Session expired, please log in again"  })
    }
}

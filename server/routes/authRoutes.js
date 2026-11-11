import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../configs/redis.js';
import { forgotPassword, login, register, resetPassword, verifyEmail } from '../controllers/authController.js';

// 20 attempts per 15 minutes per IP, shared across server restarts
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    store: new RedisStore({ sendCommand: (...args) => redis.sendCommand(args) }),
    message: { success: false, message: 'Too many attempts, please try again later' }
})

const authRouter = express.Router();

authRouter.use(authLimiter)
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/verify-email', verifyEmail)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password', resetPassword)

export default authRouter

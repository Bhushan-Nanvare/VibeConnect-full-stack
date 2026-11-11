import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import redis from '../configs/redis.js';
import sendEmail from '../configs/nodeMailer.js';

const createToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

const sendVerificationEmail = async (user) => {
    const token = crypto.randomBytes(32).toString('hex')
    await redis.setEx(`verify:${token}`, 24 * 60 * 60, user._id)

    const link = `${process.env.FRONTEND_URL}/verify-email/${token}`
    await sendEmail({
        to: user.email,
        subject: 'Verify your VibeConnect account',
        body: `<p>Hi ${user.full_name},</p>
        <p>Click <a href="${link}">here</a> to verify your email. This link expires in 24 hours.</p>`
    })
}

// Register
export const register = async (req, res) => {
    try {
        const { full_name, password } = req.body
        const email = req.body.email?.toLowerCase().trim()

        if(!full_name || !email || !password){
            return res.json({success: false, message: 'All fields are required'})
        }
        if(password.length < 8){
            return res.json({success: false, message: 'Password must be at least 8 characters'})
        }
        if(await User.findOne({email})){
            return res.json({success: false, message: 'This email is already registered'})
        }

        let username = email.split('@')[0]
        if(await User.findOne({username})){
            username = username + Math.floor(Math.random() * 10000)
        }

        const user = await User.create({
            full_name,
            email,
            username,
            password: await bcrypt.hash(password, 10),
            profile_picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=random`
        })

        await sendVerificationEmail(user)
        res.json({success: true, message: 'Account created! Check your email to verify your account.'})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Login
export const login = async (req, res) => {
    try {
        const { password } = req.body
        const email = req.body.email?.toLowerCase().trim()

        const user = await User.findOne({email}).select('+password')
        if(!user || !password || !user.password || !(await bcrypt.compare(password, user.password))){
            return res.json({success: false, message: 'Invalid email or password'})
        }

        if(!user.email_verified){
            await sendVerificationEmail(user)
            return res.json({success: false, message: 'Please verify your email first. We sent you a new link.'})
        }

        res.json({success: true, token: createToken(user._id)})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Verify Email
export const verifyEmail = async (req, res) => {
    try {
        const userId = await redis.getDel(`verify:${req.body.token}`)
        if(!userId){
            return res.json({success: false, message: 'This link is invalid or has expired'})
        }

        await User.findByIdAndUpdate(userId, {email_verified: true})
        res.json({success: true, message: 'Email verified!', token: createToken(userId)})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase().trim()
        const user = await User.findOne({email})

        if(user){
            const token = crypto.randomBytes(32).toString('hex')
            await redis.setEx(`reset:${token}`, 60 * 60, user._id)

            const link = `${process.env.FRONTEND_URL}/reset-password/${token}`
            await sendEmail({
                to: user.email,
                subject: 'Reset your VibeConnect password',
                body: `<p>Hi ${user.full_name},</p>
                <p>Click <a href="${link}">here</a> to choose a new password. This link expires in 1 hour.</p>
                <p>If you didn't ask for this, you can ignore this email.</p>`
            })
        }

        // Same reply either way, so nobody can check which emails are registered
        res.json({success: true, message: 'If this email is registered, a reset link has been sent.'})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body

        if(!password || password.length < 8){
            return res.json({success: false, message: 'Password must be at least 8 characters'})
        }

        const userId = await redis.getDel(`reset:${token}`)
        if(!userId){
            return res.json({success: false, message: 'This link is invalid or has expired'})
        }

        await User.findByIdAndUpdate(userId, {
            password: await bcrypt.hash(password, 10),
            email_verified: true
        })
        res.json({success: true, message: 'Password updated! You can log in now.'})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

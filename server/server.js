import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {inngest, functions} from './inngest/index.js'
import {serve} from 'inngest/express'
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRotes.js';
import postRouter from './routes/postRoutes.js';
import storyRouter from './routes/storyRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import inboxRouter from './routes/inboxRoutes.js';
import { subscribeToMessages } from './controllers/messageController.js';

const app = express();
app.set('trust proxy', 1);

await connectDB();
await subscribeToMessages();

// Debug: ensure ImageKit env vars are loaded
console.log('IMAGEKIT_PUBLIC_KEY loaded:', !!process.env.IMAGEKIT_PUBLIC_KEY);
console.log('IMAGEKIT_PRIVATE_KEY loaded:', !!process.env.IMAGEKIT_PRIVATE_KEY);
console.log('IMAGEKIT_URL_ENDPOINT loaded:', !!process.env.IMAGEKIT_URL_ENDPOINT);

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=> res.send('Server is running'))
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/story', storyRouter)
app.use('/api/message', messageRouter)
app.use('/api/inbox', inboxRouter)

const PORT = process.env.PORT || 4000;



app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
import express from 'express';
import { createCapsule, getCapsules, checkUnlockedCapsules } from '../controllers/capsuleController.js';

const router = express.Router();

router.post('/create', createCapsule);
router.get('/', getCapsules);
router.post('/check-unlocked', checkUnlockedCapsules);

export default router;

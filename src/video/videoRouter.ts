// src/video/videoRouter.ts
import { Router } from 'express';
import { handleVideoUpload } from './videoController';

const router = Router();

router.post('/upload', handleVideoUpload);

export default router;

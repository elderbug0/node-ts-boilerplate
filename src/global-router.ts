import { Router } from 'express';
import audioRouter from './audio/audio.router';
import videoRouter from './video/videoRouter'; // Import the video router

const globalRouter = Router();

// Use the audioRouter for audio-related routes
globalRouter.use('/audio', audioRouter);

// Use the videoRouter for video-related routes
globalRouter.use('/video', videoRouter);

// other routers can be added here

export default globalRouter;

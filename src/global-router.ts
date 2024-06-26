import { Router } from 'express';
import audioRouter from './audio/audio.router';
// other routers can be imported here

const globalRouter = Router();

// Use the userRouter for user-related routes
globalRouter.use(audioRouter);

// other routers can be added here

export default globalRouter;

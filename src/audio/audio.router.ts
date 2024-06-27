import { Router } from 'express';
import AudioService from './audio.service';
import AudioController from './audio.controller';
import multer from 'multer';

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  // Create the multer instance
  const upload = multer({ storage: storage });

const audioRouter = Router();

const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjQ4NTUwNjczMTk1OTkxMDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoicEJFOUJHSUdqeXpUTGZhQ0k4VFVBU2FUU1hqVjRiU3dAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzE5NDcyMjE3LCJleHAiOjE3MTk1NTg2MTcsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6InBCRTlCR0lHanl6VExmYUNJOFRVQVNhVFNYalY0YlN3In0.gLH7dwL-u5Qb55cBxGMjlZUWipSKtDhp9_ASLUW99Ac4cDBa-4MiyQ9Ddm1jpwDgkayNInNmkI__VKLKOEQg4BB8ys9u-m6PpMYaj9mRamb3GLwSTjEtYtidWUCAPEX-VsR-Re2nCSq_6BfJT0-9giSyIhgJtUmDUlj8ysAGyATVs6NOo4ZxicUCDqhZlTu0uqnaYiRyErLoUSc96GY8b_aLj3eGJ6ZEN3FQ7H9pHKRfl1HIC5qg9ZdLh4MgHBK14yAV5iVZX7Pft9zQbXvbbP_RiXG3IsJHJfyNrTwvHtJW5wcet-UanxmZId6vc1eqpl1_-eKRqmsQwYW56OwO5A";

const audioService = new AudioService(authToken);
const audioController = new AudioController(audioService, authToken);

audioRouter.post('/audio/upload', upload.single('audio'), audioController.uploadAndSendAudio)
audioRouter.post('/audio/messages', upload.single('audio'), audioController.getMessages)
audioRouter.post('/audio/analyze', audioController.analyze)
export default audioRouter;

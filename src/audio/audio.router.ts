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

const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjQ4NTUwNjczMTk1OTkxMDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoicEJFOUJHSUdqeXpUTGZhQ0k4VFVBU2FUU1hqVjRiU3dAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzE5NDgyMjU4LCJleHAiOjE3MTk1Njg2NTgsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6InBCRTlCR0lHanl6VExmYUNJOFRVQVNhVFNYalY0YlN3In0.hRqDgoHej7v8bcBCGLcde6lf7EY_Kyq7zfhGzRQ1HZfqQxnD9oYGBUrCILga_ik5zXlXIC_8tKITUgLfaLEVxn2uv2wfyqrQ3O1r1-FoeJTU4L8T3Bgxgq2_nKGiu_If9rTHjgVnpWDCk716lE4f-9WyxRO5qOAJ3gxFTIy0wEyJSEP9p1PRFh0xmVyET3y162ihAvSYmF3EVrjlNooD5RCImBx1RrK1W7_FhAODtCWspVW29BpLeBkoYLiZsGZFX_JaU1aFtWBE6nLXaP_5V562Y32lOZ7JAz4jXYPD5OHugQeU7eJ_0NFOYilJeAq8s_O9VNe3DTljIrdnyte1pA";

const audioService = new AudioService(authToken);
const audioController = new AudioController(audioService, authToken);

audioRouter.post('/audio/upload', upload.single('audio'), audioController.uploadAndSendAudio)
audioRouter.post('/audio/messages', upload.single('audio'), audioController.getMessages)
audioRouter.post('/audio/analyze', audioController.analyze)
export default audioRouter;

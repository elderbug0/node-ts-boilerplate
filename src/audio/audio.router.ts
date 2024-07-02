import { Router } from 'express';
import AudioService from './audio.service';
import AudioController from './audio.controller';
import multer from 'multer';

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'audio_data/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  // Create the multer instance
  const upload = multer({ storage: storage });

const audioRouter = Router();

const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjQ4NTUwNjczMTk1OTkxMDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoicEJFOUJHSUdqeXpUTGZhQ0k4VFVBU2FUU1hqVjRiU3dAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzE5OTAyNjM3LCJleHAiOjE3MTk5ODkwMzcsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6InBCRTlCR0lHanl6VExmYUNJOFRVQVNhVFNYalY0YlN3In0.ARzZot9WHBZei5vsu61FN8Chvq2-nYvvL_BiuNv67RcTF7huoKF0_TfSW0ZW9uQIMzhmiZnXUwCxZDKDINBc_fx34RIvuoi_S-pUpAmtFF3SLbG-4vxzlzMiTNyVkfK6eNKXyogFzrc7-Y3KDkMAGIRt_HG7zYugqyNEbjT7d6B45d6JZUAKF41zMepw9QQsm3erhxtjk0Tx3QT29_z7v2zRWwsWdQwtHYFM71GsNiXoGKxEel42BNxWSIQSu2Kmqj4VMBF7EkJYQJiL06IYjKT7DqBrQhjWDEhAvHDz99UoJpdH9hDZpSR1RInsGwhrkkw0XmSDUdOQNgclRT6K7A";

const audioService = new AudioService(authToken);
const audioController = new AudioController(audioService, authToken);

audioRouter.post('/upload', upload.single('audio'), audioController.uploadAndSendAudio)
audioRouter.post('/messages', upload.single('audio'), audioController.getMessages)
audioRouter.post('/analyze', audioController.analyze)
export default audioRouter;

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

const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjQ4NTUwNjczMTk1OTkxMDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoicEJFOUJHSUdqeXpUTGZhQ0k4VFVBU2FUU1hqVjRiU3dAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzE5NTY2NTA3LCJleHAiOjE3MTk2NTI5MDcsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6InBCRTlCR0lHanl6VExmYUNJOFRVQVNhVFNYalY0YlN3In0.IneTlA6cc2xU2tZbGRpMSROlXmCY5xT-2c8I_DKOal8vfyFv-UiNkYs2lP0mpouwSj8zWrTIsEBfsKHe9Hv46fAqc1rGaEtUvE5qQ80CVeWOcMym6ZFnOOGZ7bd7TycVFI4oTAqtJhsF7IXc5jhLL78pnwNkSD9dFWn_5scXRDFptZbk7f6J0s4F3Voyyd6ZKf6_kkGq5Lg3DWsX1z0RxDPmtVj9vaBldhONjfW4q0LxMUgT-fWpzSmheWYzICjXmvI0ITCxNXowyRANeY5AYlqY1QY-d_nOlEVzaH2-U6Q4qnKSp4IApUNNZOCAhCZzmevcJ4nCnpQZByHaXRCDuQ";

const audioService = new AudioService(authToken);
const audioController = new AudioController(audioService, authToken);

audioRouter.post('/audio/upload', upload.single('audio'), audioController.uploadAndSendAudio)
audioRouter.post('/audio/messages', upload.single('audio'), audioController.getMessages)
audioRouter.post('/audio/analyze', audioController.analyze)
export default audioRouter;

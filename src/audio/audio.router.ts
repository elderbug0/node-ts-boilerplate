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

const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjQ4NTUwNjczMTk1OTkxMDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoicEJFOUJHSUdqeXpUTGZhQ0k4VFVBU2FUU1hqVjRiU3dAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzE5Mzg3MzI2LCJleHAiOjE3MTk0NzM3MjYsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6InBCRTlCR0lHanl6VExmYUNJOFRVQVNhVFNYalY0YlN3In0.2cmbGAk7kcbDqBrpHXfBpRyesAvPeton1_919t70u6M4DCkSnA3z2Pxyok-rrqn7DsEoZBHqDgP0gSnpHJW8d-dbXvvCHW0J_3v45NBLc_bwnBXe1IdEMUB0pSNu2kwkYIGIb6f9TZQLxm15tif7Fam4yorb1xj8975_VfcZriu0kRNiBRYoVGOqgas19TS482mUrzBKlu50s6hOkI_dZtfBUaQx8y_zELBLMk38HtNhyZRVcLwRnXpF1-zKCd0YxIMGE20E2TE6ZAO4FZOmyI0EzQem26V6DkUVS_7sThVzDCtE5kdmKzF_vnuucivC17_IFRKA8wJXxA344b8k6w";

const audioService = new AudioService(authToken);
const audioController = new AudioController(audioService, authToken);

audioRouter.post('/audio/upload', upload.single('audio'), audioController.uploadAndSendAudio)
audioRouter.post('/audio/messages', upload.single('audio'), audioController.getMessages)
export default audioRouter;

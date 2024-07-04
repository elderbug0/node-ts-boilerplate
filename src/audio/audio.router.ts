import { Router } from 'express';
import multer from 'multer';
import AudioService from './audio.service';
import AudioController from './audio.controller';
import * as fs from 'fs';
import * as path from 'path';

// Ensure the audio_data directory exists
const audioDataDir = path.resolve(__dirname, 'audio_data');
if (!fs.existsSync(audioDataDir)) {
  fs.mkdirSync(audioDataDir);
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioDataDir);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + file.originalname;
    console.log(`Saving file as: ${fileName}`);
    cb(null, fileName);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

const audioRouter = Router();

const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjQ4NTUwNjczMTk1OTkxMDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoicEJFOUJHSUdqeXpUTGZhQ0k4VFVBU2FUU1hqVjRiU3dAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzIwMTEzNzU0LCJleHAiOjE3MjAyMDAxNTQsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6InBCRTlCR0lHanl6VExmYUNJOFRVQVNhVFNYalY0YlN3In0.qmIMehgF4hAVcnix5lVsRUFW3npbbNAPn5mqrpVk-6SThdgsUbLo-DlBm53QTnpMfRsFc6AESZ4ZWnSMddE1SdBjsLyjQlGsVlyjTC0kJdQOEnchLyZgD6g7O4y1soQdt-4BDc8j4QGqoX8gVN39TjzCc020cKR41drb_SC6KES3qP29JEgZ69HHLb-q99vk9ymRdQDoozrt6t3XIcxPyReno1xiVQm51k5U-lcddROwclPnZg3mRnKzdhhzHreNiOJ556sSCdoJYbsibXHWkwLDWRgtioV8tgf9r4ss6Pz5h9cbTL4RlSf8XqNpVSQy6-DqOSjuPQZdxtVgW10nFg";

const audioService = new AudioService(authToken);
const audioController = new AudioController(audioService, authToken);

audioRouter.post('/upload', upload.single('audio'), audioController.uploadAndSendAudio)
audioRouter.post('/messages', upload.single('audio'), audioController.getMessages)
audioRouter.post('/analyze', audioController.analyze)
export default audioRouter;

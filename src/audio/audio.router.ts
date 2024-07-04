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

const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjQ4NTUwNjczMTk1OTkxMDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoicEJFOUJHSUdqeXpUTGZhQ0k4VFVBU2FUU1hqVjRiU3dAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzIwMDE4NDQ1LCJleHAiOjE3MjAxMDQ4NDUsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6InBCRTlCR0lHanl6VExmYUNJOFRVQVNhVFNYalY0YlN3In0.qykwzDLOV_7Jyp5-sOyABTckZ9tbeV1mtzMumwLyNIkKQfJNa5_aM81YI3ZRbQA4lKcctby6Y_UF_KWCnWXRGXXl89UJWGExpiWoJtelJb-SQMO9rF-L3YEvTGb8IAL4yMYOKyP9BWFGuDqSVCtrCAKX7bfnRgFTPybS-4PO15f5MobmdDMfOFeyU2JmMarCdyfg5732NJo42723TkI3AUz9j4AggJsfntMTQcS-mGbjAI5sMes1r35rL0uIs5fV7_-dCoEJBlvPsctmCVq8gM8Wr4SBTaZJPmSEzEB0HEUbAeNjBh8XQAP3XsqlsKbuxE9B0qa0_4QoxWzl7-Cc1w";

const audioService = new AudioService(authToken);
const audioController = new AudioController(audioService, authToken);

audioRouter.post('/upload', upload.single('audio'), audioController.uploadAndSendAudio)
audioRouter.post('/messages', upload.single('audio'), audioController.getMessages)
audioRouter.post('/analyze', audioController.analyze)
export default audioRouter;

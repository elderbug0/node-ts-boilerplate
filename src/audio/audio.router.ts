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

const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjYyNDY1MzE4MDAzNjcxMDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoidzhXRlp2eWlEWjBETnlrdnFsSWZqRmZqVUU1REN6Q3hAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzIwNjAyODUyLCJleHAiOjE3MjA2ODkyNTIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6Inc4V0ZadnlpRFowRE55a3ZxbElmakZmalVFNURDekN4In0.lOaYVYRXQELqXNNbolgjRmD8nrup8F2zzUXpOJaqaWwGjr8RV-Wrof_vh-NxehNigsnPK-g8ErL5IWAkuOm4RmGCnqYY0pfbyFZ7WlhrIRbiVk-lFN_sUhOLEcMoEBW8ibj5OQEXcYk115xf7WCrBcAuwRBnDbJeztFgyu7u4gHUzbiZmctt8BSQI_JzdEUr1RR3BlWtSTKGOk4BLIC12Gv-t9C0QsDQwA-7-tJwq6jVKWIeZzJfwSUdBTiXGbVFigxs9RuKDNzFqhqnQZTdmJYHEk8hexFl8rHKy9NbUprHj4dDUgZT3amoUKSZmPuRx_C3GJwhMql_-XS8y8EBMQ";

const audioService = new AudioService(authToken);
const audioController = new AudioController(audioService, authToken);

audioRouter.post('/upload', upload.single('audio'), audioController.uploadAndSendAudio)
audioRouter.post('/messages', upload.single('audio'), audioController.getMessages)
audioRouter.post('/analyze', audioController.analyze)
export default audioRouter;

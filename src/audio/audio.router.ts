import { Router } from 'express';
import multer from 'multer';
import AudioService from './audio.service';
import AudioController from './audio.controller';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();
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

const authToken = process.env.AUTH_TOKEN!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

const audioService = new AudioService(authToken, openaiApiKey);
const audioController = new AudioController(audioService, authToken);

audioRouter.post('/uploadd', upload.single('audio'), audioController.uploadAndSendAudio);
audioRouter.get('/status/:publicId', audioController.getAudioStatus);
audioRouter.post('/analyze-text', audioController.analyzeSpeechText);

export default audioRouter;

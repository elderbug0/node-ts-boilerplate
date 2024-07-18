import { Request, Response } from "express";
import AudioService from "./audio.service";

class AudioController {
  private audioService: AudioService;
  private authToken: string;

  constructor(audioService: AudioService, authToken: string) {
    this.audioService = audioService;
    this.authToken = authToken;
  }

  uploadAndSendAudio = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const language = req.body.language || 'en'; // Default to 'en' if not provided

    try {
      const result = await this.audioService.saveAndSendAudio(filePath, language);
      console.log("Result sent to frontend:", result);
      res.json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }

  getAudioStatus = async (req: Request, res: Response) => {
    const { publicId } = req.params;

    try {
      const result = await this.audioService.getAudioStatus(publicId);
      console.log("Result sent to frontend:", result);
      res.json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }

  analyzeSpeechText = async (req: Request, res: Response) => {
    const { text, language } = req.body;

    try {
      const result = await this.audioService.analyzeSpeechText(text, language);
      console.log("Result sent to frontend:", result);
      res.json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
}

export default AudioController;

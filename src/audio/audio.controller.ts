import { Request, Response } from "express";
import AudioService from "./audio.service";
import axios from "axios";
import request from "request";
import * as fs from 'fs';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AudioController {
  private audioService: AudioService;
  private authToken: string;

  constructor(audioService: AudioService, authToken: string) {
    this.audioService = audioService;
    this.authToken = authToken;
  }

  uploadAndSendAudio = async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send("Audio file is missing");
      }
      const params = {
        name: "Audio",
        languageCode: "en-US",
      };

      const audioFileStream = fs.createReadStream(file.path);

      const audioOption = {
        url: 'https://api.symbl.ai/v1/process/audio',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'audio/wav'
        },
        qs: params,
        json: true,
      };

      const responses = {
        400: 'Bad Request! Please refer docs for correct input fields.',
        401: 'Unauthorized. Please generate a new access token.',
        404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
        429: 'Maximum number of concurrent jobs reached. Please wait for some requests to complete.',
        500: 'Something went wrong! Please contact support@symbl.ai'
      };

      audioFileStream.pipe(request.post(audioOption, (err, response, body) => {
        const statusCode = response.statusCode;
        if (err || Object.keys(responses).indexOf(statusCode.toString()) !== -1) {
          throw new Error(responses[statusCode]);
        }
        console.log('Status code: ', statusCode);
        console.log('Body', response.body);
        return res.status(200).json(response.body);
      }));
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  };

  getMessages = async (req: Request, res: Response) => {
    const { conversationId } = req.body;
    const interval = 30000; // 30 seconds
    let resultSent = false;

    const checkMessages = async () => {
      try {
        const messagesResponse = await axios.get(
          `https://api.symbl.ai/v1/conversations/${conversationId}/messages?sentiment=true`,
          {
            headers: { Authorization: `Bearer ${this.authToken}` },
          }
        );

        const analyticsResponse = await axios.get(
          `https://api.symbl.ai/v1/conversations/${conversationId}/analytics`,
          {
            headers: { Authorization: `Bearer ${this.authToken}` },
          }
        );

        if (
          messagesResponse.data &&
          messagesResponse.data.messages &&
          messagesResponse.data.messages.length > 0 ||
          analyticsResponse.data &&
          analyticsResponse.data.analytics &&
          analyticsResponse.data.analytics.length > 0
        ) {
          const combinedResponse = {
            transcript: messagesResponse.data,
            analytics: analyticsResponse.data
          };
          res.status(200).json(combinedResponse);
          resultSent = true;
        }
      } catch (error: any) {
        console.log('Error fetching messages and analytics:', error.message);
      }
    };

    const intervalId = setInterval(async () => {
      if (!resultSent) {
        await checkMessages();
      } else {
        clearInterval(intervalId);
      }
    }, interval);

    // Initial check
    await checkMessages();
  };

  analyze = async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.body;
      console.log('Fetching analytics for conversationId:', conversationId); // Debug log

      const response = await axios.get(
        `https://api.symbl.ai/v1/conversations/${conversationId}/analytics`,
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
        }
      );

      console.log('Analytics response:', response.data); // Debug log
      return res.status(200).json(response.data);
    } catch (error: any) {
      console.log('Error fetching analytics:', error.message); // Debug log
      return res.status(500).json({ error: error.message });
    }
  };
}

export default AudioController;

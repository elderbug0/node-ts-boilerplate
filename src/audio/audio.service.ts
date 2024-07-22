import * as fs from "fs";
import axios from "axios";
import FormData from "form-data";
import OpenAI from "openai";

class AudioService {
  private authToken: string;
  private openai: OpenAI;

  constructor(authToken: string, openaiApiKey: string) {
    this.authToken = authToken;
    this.openai = new OpenAI({ apiKey: openaiApiKey });
  }

  private async readPrompt(language: string): Promise<string> {
    const filePath = language === 'en' ? './src/audio/prompt1.txt' : './src/audio/prompt2.txt';
    return fs.promises.readFile(filePath, 'utf-8');
  }

  public saveAndSendAudio = async (filePath: string, language: string): Promise<any> => {
    try {
      const form = new FormData();
      form.append("providers", "openai");
      form.append("file", fs.createReadStream(filePath));
      form.append("language", language); // Set the language dynamically

      const options = {
        method: "POST",
        url: "https://api.edenai.run/v2/audio/speech_to_text_async",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`,
        },
        data: form,
      };

      const response = await axios.request(options);
      return response.data;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(`Failed to analyze audio: ${error.message}`);
    }
  };

  public getAudioStatus = async (publicId: string): Promise<any> => {
    try {
      const options = {
        method: "GET",
        url: `https://api.edenai.run/v2/audio/speech_to_text_async/${publicId}`,
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        }
      };

      const response = await axios.request(options);
      return response.data;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(`Failed to get audio status: ${error.message}`);
    }
  };

  public analyzeSpeechText = async (text: string, language: string): Promise<any> => {
    try {
      const promptTemplate = await this.readPrompt(language);
      const prompt = promptTemplate.replace("${text}", text);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a public speaking master" },
          { role: "user", content: prompt }
        ],
      });

      const responseText = completion.choices[0].message.content;
      console.log("Response from GPT:", responseText);
      return responseText;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(`Failed to analyze speech text: ${error.message}`);
    }
  };

  public deleteFile = async (filePath: string): Promise<void> => {
    try {
      await fs.promises.unlink(filePath);
      console.log(`File ${filePath} deleted successfully`);
    } catch (error: any) {
      console.error(`Failed to delete file ${filePath}: ${error.message}`);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  };
}

export default AudioService;

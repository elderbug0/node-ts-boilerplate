import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const API_KEY = 'AIzaSyAtmZXJDrZlo_ad2OhIJSjaWPqaEaCss-U';

const fileManager = new GoogleAIFileManager(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

const readPromptFile = (filePath: string): string => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading file: ${filePath}`, err);
    throw err;
  }
};

export const uploadFile = async (filePath: string, displayName: string) => {
  return await fileManager.uploadFile(filePath, {
    mimeType: 'video/mp4',
    displayName: displayName,
  });
};

export const checkFileState = async (fileName: string): Promise<void> => {
  let file = await fileManager.getFile(fileName);
  while (file.state === FileState.PROCESSING) {
    process.stdout.write(".");
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Sleep for 10 seconds
    file = await fileManager.getFile(fileName);
  }

  if (file.state === FileState.FAILED) {
    throw new Error("Video processing failed.");
  }

  console.log(`File ${file.displayName} is ready for inference as ${file.uri}`);
};

export const generateContent = async (fileUri: string, mimeType: string, language: string) => {
  const promptFilePath = language === 'ru' ? path.join('./src/video/promt2.txt') : path.join('./src/video/promt.txt');
  const prompt = readPromptFile(promptFilePath);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  return await model.generateContent([
    {
      fileData: {
        mimeType: mimeType,
        fileUri: fileUri,
      },
    },
    { text: prompt },
  ]);
};

export const deleteFile = async (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`, err);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
  });
};

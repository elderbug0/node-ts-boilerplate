import { Request, Response } from 'express';
import { uploadFile, checkFileState, generateContent, deleteFile } from './videoService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer to save files to the 'video_data' directory
const upload = multer({ dest: path.resolve(__dirname, '../../video_data/') });

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export const handleVideoUpload = [
  upload.single('video'),  // 'video' is the field name in the form-data
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        throw new Error('File not provided');
      }

      const { path: filePath, originalname } = req.file;
      console.log(`Received file: ${originalname} at ${filePath}`); // Log the file info

      // Save the video file to 'video_data'
      const videoDataPath = path.resolve(__dirname, '../../video_data/', originalname);
      fs.renameSync(filePath, videoDataPath);
      console.log(`File saved to: ${videoDataPath}`); // Log the save location

      // Upload the video file using your Google Generative AI setup
      const uploadResult = await uploadFile(videoDataPath, originalname);
      console.log(`Upload result: ${JSON.stringify(uploadResult)}`); // Log the upload result

      // Check the state of the uploaded file
      await checkFileState(uploadResult.file.name);

      // Generate content using the uploaded video file
      const result = await generateContent(uploadResult.file.uri, uploadResult.file.mimeType);
      console.log(`Generated content: ${JSON.stringify(result)}`); // Log the generated content

      // Ensure the response structure is valid
      const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No generated text available.";

      res.json({ description: text });

      // Optionally delete the video file after processing
      await deleteFile(videoDataPath);
    } catch (error) {
      console.error('Error handling video upload:', error); // Log the error
      if (isError(error)) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
];

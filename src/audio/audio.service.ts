import * as fs from "fs";
import axios from "axios";
import request from "request";
class AudioService {
  private authToken: string;

  constructor(authToken: string) {
    this.authToken = authToken;
  }

  public saveAndSendAudio = async (filePath: string): Promise<any> => {
    try {
      
    } catch (error: any) {
      console.error(error.message);
      throw new Error(`Failed to analyze audio: ${error.message}`);
    }
  };


}

export default AudioService;

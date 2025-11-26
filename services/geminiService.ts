import { GoogleGenAI, Type } from "@google/genai";
import { blobToBase64 } from '../utils/audioUtils';
import { NoteData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to guide the model's persona
const SYSTEM_INSTRUCTION = `
You are an expert academic assistant designed to help students. 
Your task is to process audio recordings of university lectures.

1. Transcribe the audio accurately.
2. Summarize the main points concisely in Korean (한국어).
3. Extract key terminology and definitions in Korean (한국어).
4. Suggest potential exam questions based on the content in Korean (한국어).

Return the output in a strict JSON format.
`;

export const analyzeLectureAudio = async (audioBlob: Blob): Promise<NoteData> => {
  try {
    const base64Audio = await blobToBase64(audioBlob);
    
    // Determine mime type (default to webm or map based on blob type)
    const mimeType = audioBlob.type || 'audio/webm';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          },
          {
            text: "Analyze this lecture recording. Provide a transcript, a summary (in Korean), key terms (in Korean), and exam questions (in Korean)."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcript: { type: Type.STRING, description: "Full transcription of the audio" },
            summary: { type: Type.STRING, description: "Concise summary of the lecture content in Korean" },
            keyTerms: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of important terms and their brief definitions in Korean"
            },
            examQuestions: {
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 potential exam questions based on the lecture in Korean"
            }
          },
          required: ["transcript", "summary", "keyTerms", "examQuestions"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(response.text) as NoteData;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
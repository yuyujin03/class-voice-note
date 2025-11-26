export interface NoteData {
  summary: string;
  transcript: string;
  keyTerms: string[];
  examQuestions: string[];
}

export interface Recording {
  id: string;
  title: string;
  subject: string; // New field for folder categorization
  date: Date;
  duration: number; // in seconds
  audioBlob?: Blob; // Optional because it cannot be easily persisted in localStorage
  status: 'recorded' | 'processing' | 'completed' | 'error';
  data?: NoteData;
  errorMessage?: string;
}

export type ViewState = 'list' | 'detail' | 'recording';

export interface RecorderState {
  isRecording: boolean;
  recordingTime: number;
  analyserData: Uint8Array;
}
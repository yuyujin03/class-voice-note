import React from 'react';
import { Mic, Square } from 'lucide-react';
import { formatTime } from '../utils/audioUtils';
import Visualizer from './Visualizer';

interface RecorderProps {
  isRecording: boolean;
  duration: number;
  analyser: AnalyserNode | null;
  permissionError: string | null;
  onToggleRecording: () => void;
}

const Recorder: React.FC<RecorderProps> = ({ 
  isRecording, 
  duration, 
  analyser, 
  permissionError, 
  onToggleRecording 
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 w-full max-w-2xl mx-auto flex-1">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">
          {isRecording ? "강의 녹음 중..." : "새로운 강의 녹음"}
        </h2>
        <p className="text-slate-500">
          {isRecording 
            ? "다른 페이지로 이동해도 녹음은 계속됩니다." 
            : "버튼을 눌러 녹음을 시작하세요. AI가 자동으로 정리해드립니다."}
        </p>
      </div>

      <div className="relative w-full flex justify-center py-6">
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="animate-ping absolute inline-flex h-48 w-48 rounded-full bg-indigo-400 opacity-75"></div>
          </div>
        )}
        
        <button
          onClick={onToggleRecording}
          className={`relative z-10 flex items-center justify-center w-24 h-24 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 ${
            isRecording 
              ? 'bg-rose-500 hover:bg-rose-600 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isRecording ? (
            <Square size={32} fill="currentColor" />
          ) : (
            <Mic size={36} />
          )}
        </button>
      </div>

      <div className="text-4xl font-mono font-medium text-slate-700 tracking-wider">
        {formatTime(duration)}
      </div>

      <div className="w-full bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200">
        <Visualizer analyser={analyser} isRecording={isRecording} />
      </div>

      {permissionError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {permissionError}
        </div>
      )}
    </div>
  );
};

export default Recorder;
import React, { useState, useRef } from 'react';
import { Mic, Square, Sparkles, Radio, Zap } from 'lucide-react';

export function VoiceRecorder({ onProcessTranscript, isProcessing, mode }) {
  const [recordMode, setRecordMode] = useState('TAP');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [customText, setCustomText] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onProcessTranscript(null, audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((p) => p + 1), 1000);
    } catch (err) {
      alert('Microphone access denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onProcessTranscript(customText.trim(), null);
    setCustomText('');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 mb-5 shadow-sm">
      
      {/* Mode Selector Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Voice Logger
        </span>

        <div className="bg-black p-0.5 rounded-lg border border-zinc-800 flex text-[11px]">
          <button
            onClick={() => setRecordMode('TAP')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              recordMode === 'TAP' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-blue-400" />
            <span>Tap & Hold</span>
          </button>

          <button
            onClick={() => setRecordMode('AMBIENT')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              recordMode === 'AMBIENT' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Radio className="w-3 h-3 text-white" />
            <span>Ambient Stream</span>
          </button>
        </div>
      </div>

      {/* Centerpiece Record Button in Electric Blue */}
      <div className="flex flex-col items-center justify-center py-7 bg-black rounded-xl border border-zinc-800/80 mb-4">
        
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
            isRecording
              ? 'bg-rose-600 ring-4 ring-rose-500/30 animate-pulse'
              : recordMode === 'AMBIENT'
              ? 'bg-blue-600 hover:bg-blue-500 ring-4 ring-blue-500/20'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 animate-mic-pulse-blue'
          }`}
        >
          {isRecording ? (
            <Square className="w-8 h-8 text-white fill-current" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>

        <div className="mt-3.5 text-center">
          <p className="text-xs font-bold text-white">
            {isRecording
              ? `Recording... (${recordingTime}s)`
              : isProcessing
              ? 'Processing Vercel Serverless Agent...'
              : recordMode === 'AMBIENT'
              ? 'Ambient Stream Active (Continuous)'
              : 'Tap Mic to Log Spoken Sale'}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            e.g. "Sold 2 croissants for 9 dollars" or "One oat latte"
          </p>
        </div>
      </div>

      {/* Manual Typing Fallback */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Or type spoken transaction..."
          className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!customText.trim() || isProcessing}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Log</span>
        </button>
      </form>
    </div>
  );
}

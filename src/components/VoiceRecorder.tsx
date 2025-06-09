
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Square, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onAnalysisComplete?: (analysis: any) => void;
}

const VoiceRecorder = ({ onAnalysisComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak naturally about how you're feeling",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Audio saved successfully",
      });
    }
  };

  const playAudio = () => {
    if (audioURL && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const analyzeMood = async () => {
    if (!audioURL) return;

    setIsAnalyzing(true);
    try {
      // Convert audio to base64 for analysis
      const response = await fetch(audioURL);
      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Simulate mood analysis (in real app, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        mood: ["happy", "neutral", "stressed", "anxious", "excited"][Math.floor(Math.random() * 5)],
        confidence: Math.floor(Math.random() * 30) + 70,
        energy: Math.floor(Math.random() * 50) + 50,
        timestamp: new Date().toISOString(),
      };

      onAnalysisComplete?.(mockAnalysis);
      
      toast({
        title: "Analysis Complete",
        description: `Detected mood: ${mockAnalysis.mood} (${mockAnalysis.confidence}% confidence)`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze audio",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mic className="h-5 w-5 mr-2 text-blue-500" />
          Voice Mood Analysis
        </CardTitle>
        <CardDescription>Record your voice to analyze mood and emotional state</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button onClick={startRecording} className="flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive" className="flex items-center">
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          )}
        </div>

        {audioURL && (
          <div className="space-y-4">
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <div className="flex justify-center space-x-4">
              <Button onClick={playAudio} variant="outline" className="flex items-center">
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              
              <Button 
                onClick={analyzeMood} 
                disabled={isAnalyzing}
                className="flex items-center"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Mood"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceRecorder;

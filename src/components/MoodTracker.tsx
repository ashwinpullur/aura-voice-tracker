
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Calendar } from "lucide-react";

interface MoodEntry {
  id: string;
  mood: string;
  confidence: number;
  energy: number;
  timestamp: string;
  source: 'voice' | 'manual';
}

interface MoodTrackerProps {
  onMoodAdd?: (mood: MoodEntry) => void;
}

const MoodTracker = ({ onMoodAdd }: MoodTrackerProps) => {
  const [moods, setMoods] = useState<MoodEntry[]>([
    {
      id: '1',
      mood: 'happy',
      confidence: 85,
      energy: 75,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      source: 'voice'
    },
    {
      id: '2',
      mood: 'neutral',
      confidence: 90,
      energy: 60,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      source: 'manual'
    }
  ]);

  const manualMoods = ['happy', 'sad', 'excited', 'anxious', 'calm', 'stressed', 'energetic', 'tired'];

  const addManualMood = (mood: string) => {
    const newMood: MoodEntry = {
      id: Date.now().toString(),
      mood,
      confidence: 100,
      energy: Math.floor(Math.random() * 50) + 50,
      timestamp: new Date().toISOString(),
      source: 'manual'
    };
    
    setMoods(prev => [newMood, ...prev]);
    onMoodAdd?.(newMood);
  };

  const addVoiceMood = (analysis: any) => {
    const newMood: MoodEntry = {
      id: Date.now().toString(),
      mood: analysis.mood,
      confidence: analysis.confidence,
      energy: analysis.energy,
      timestamp: analysis.timestamp,
      source: 'voice'
    };
    
    setMoods(prev => [newMood, ...prev]);
    onMoodAdd?.(newMood);
  };

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      happy: 'bg-green-100 text-green-800',
      sad: 'bg-blue-100 text-blue-800',
      excited: 'bg-yellow-100 text-yellow-800',
      anxious: 'bg-red-100 text-red-800',
      calm: 'bg-purple-100 text-purple-800',
      stressed: 'bg-orange-100 text-orange-800',
      energetic: 'bg-pink-100 text-pink-800',
      tired: 'bg-gray-100 text-gray-800',
      neutral: 'bg-slate-100 text-slate-800',
    };
    return colors[mood] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            Quick Mood Check
          </CardTitle>
          <CardDescription>How are you feeling right now?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {manualMoods.map((mood) => (
              <Button
                key={mood}
                variant="outline"
                onClick={() => addManualMood(mood)}
                className="capitalize"
              >
                {mood}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Mood History
          </CardTitle>
          <CardDescription>Your recent emotional patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {moods.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge className={getMoodColor(entry.mood)}>
                    {entry.mood}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {entry.source === 'voice' ? '🎤' : '✋'} {entry.confidence}% confidence
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;

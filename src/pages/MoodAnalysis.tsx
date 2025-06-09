
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Brain, Mic, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoiceRecorder from "@/components/VoiceRecorder";
import MoodTracker from "@/components/MoodTracker";
import MoodPrediction from "@/components/MoodPrediction";

const MoodAnalysis = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleAnalysisComplete = (analysis: any) => {
    setAnalysisData(analysis);
  };

  const handleMoodAdd = (mood: any) => {
    console.log('New mood added:', mood);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mood Analysis</h1>
            <p className="text-muted-foreground">Voice analysis and emotional wellness tracking</p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="voice" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voice" className="flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              Voice Analysis
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Mood Tracking
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-6">
            <VoiceRecorder onAnalysisComplete={handleAnalysisComplete} />
            
            {analysisData && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>Latest voice mood analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold capitalize">{analysisData.mood}</div>
                      <div className="text-sm text-muted-foreground">Detected Mood</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{analysisData.confidence}%</div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{analysisData.energy}%</div>
                      <div className="text-sm text-muted-foreground">Energy Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tracking">
            <MoodTracker onMoodAdd={handleMoodAdd} />
          </TabsContent>

          <TabsContent value="predictions">
            <MoodPrediction />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MoodAnalysis;

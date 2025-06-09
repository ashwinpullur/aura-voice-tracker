
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Brain, AlertTriangle, Lightbulb } from "lucide-react";

interface PredictionData {
  nextMoodPrediction: string;
  confidence: number;
  stressLevel: number;
  recommendations: string[];
  trends: {
    mood: string;
    frequency: number;
  }[];
}

const MoodPrediction = () => {
  // Mock prediction data - in real app, this would come from AI analysis
  const prediction: PredictionData = {
    nextMoodPrediction: 'calm',
    confidence: 78,
    stressLevel: 65,
    recommendations: [
      'Consider taking a 10-minute walk',
      'Practice deep breathing exercises',
      'Stay hydrated - drink more water',
      'Take regular breaks from work'
    ],
    trends: [
      { mood: 'happy', frequency: 40 },
      { mood: 'neutral', frequency: 35 },
      { mood: 'stressed', frequency: 25 }
    ]
  };

  const getStressColor = (level: number) => {
    if (level < 30) return 'text-green-600';
    if (level < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressBgColor = (level: number) => {
    if (level < 30) return 'bg-green-500';
    if (level < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            AI Mood Prediction
          </CardTitle>
          <CardDescription>Based on your recent patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold capitalize text-foreground">
              {prediction.nextMoodPrediction}
            </div>
            <div className="text-sm text-muted-foreground">
              Predicted next mood ({prediction.confidence}% confidence)
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Stress Level</span>
              <span className={`text-sm font-bold ${getStressColor(prediction.stressLevel)}`}>
                {prediction.stressLevel}%
              </span>
            </div>
            <Progress 
              value={prediction.stressLevel} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Mood Patterns
          </CardTitle>
          <CardDescription>Your emotional trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prediction.trends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="capitalize font-medium">{trend.mood}</span>
                <div className="flex items-center space-x-2 flex-1 ml-4">
                  <Progress value={trend.frequency} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-8">
                    {trend.frequency}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            Wellness Recommendations
          </CardTitle>
          <CardDescription>Personalized suggestions for better wellbeing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prediction.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodPrediction;

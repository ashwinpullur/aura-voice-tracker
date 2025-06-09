
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Heart, Scale, Thermometer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Vitals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vitals, setVitals] = useState({
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    weight: "",
    temperature: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to a database
    toast({
      title: "Vitals Saved",
      description: "Your vital signs have been recorded successfully.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Log Vitals</h1>
            <p className="text-muted-foreground">Record your vital signs</p>
          </div>
        </div>

        {/* Vitals Form */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Blood Pressure
              </CardTitle>
              <CardDescription>Enter your blood pressure readings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systolic">Systolic (mmHg)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="120"
                    value={vitals.bloodPressureSystolic}
                    onChange={(e) => handleInputChange("bloodPressureSystolic", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="80"
                    value={vitals.bloodPressureDiastolic}
                    onChange={(e) => handleInputChange("bloodPressureDiastolic", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-blue-500" />
                Heart Rate
              </CardTitle>
              <CardDescription>Your current heart rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="72"
                  value={vitals.heartRate}
                  onChange={(e) => handleInputChange("heartRate", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2 text-green-500" />
                Weight
              </CardTitle>
              <CardDescription>Your current weight</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={vitals.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
                Temperature
              </CardTitle>
              <CardDescription>Your body temperature</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  value={vitals.temperature}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full">
          Save Vitals
        </Button>
      </div>
    </div>
  );
};

export default Vitals;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Pill, Clock, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Medications = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Aspirin",
      dosage: "100mg",
      frequency: "Once daily",
      time: "08:00",
      taken: false,
    },
    {
      id: 2,
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      time: "08:00",
      taken: true,
    },
    {
      id: 3,
      name: "Blood Pressure Medicine",
      dosage: "10mg",
      frequency: "Twice daily",
      time: "08:00, 20:00",
      taken: false,
    },
  ]);

  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setNewMedication(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMedication = () => {
    const medication = {
      id: medications.length + 1,
      ...newMedication,
      taken: false,
    };
    setMedications(prev => [...prev, medication]);
    setNewMedication({ name: "", dosage: "", frequency: "", time: "" });
    setShowForm(false);
  };

  const toggleMedicationTaken = (id: number) => {
    setMedications(prev =>
      prev.map(med =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Medications</h1>
              <p className="text-muted-foreground">Track your medication schedule</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>

        {/* Add Medication Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>New Medication</CardTitle>
              <CardDescription>Add a new medication to your schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medication-name">Medication Name</Label>
                  <Input
                    id="medication-name"
                    placeholder="Aspirin"
                    value={newMedication.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="100mg"
                    value={newMedication.dosage}
                    onChange={(e) => handleInputChange("dosage", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    placeholder="Once daily"
                    value={newMedication.frequency}
                    onChange={(e) => handleInputChange("frequency", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time(s)</Label>
                  <Input
                    id="time"
                    placeholder="08:00"
                    value={newMedication.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddMedication}>Save Medication</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pill className="h-5 w-5 mr-2 text-green-500" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Mark medications as taken</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medications.map((medication) => (
                <div
                  key={medication.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    medication.taken ? 'bg-green-50 border-green-200' : 'bg-background border-border'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={medication.taken}
                      onCheckedChange={() => toggleMedicationTaken(medication.id)}
                    />
                    <div>
                      <h4 className="font-semibold">{medication.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {medication.dosage} • {medication.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{medication.time}</span>
                    <Button variant="ghost" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medication History */}
        <Card>
          <CardHeader>
            <CardTitle>Medication History</CardTitle>
            <CardDescription>View your medication adherence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Pill className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Medication history will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Medications;

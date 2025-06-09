
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, Plus, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Smith",
      specialty: "Cardiologist",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "City Medical Center",
    },
    {
      id: 2,
      doctor: "Dr. Johnson",
      specialty: "General Practitioner",
      date: "2024-01-20",
      time: "2:30 PM",
      location: "Downtown Clinic",
    },
  ]);

  const [newAppointment, setNewAppointment] = useState({
    doctor: "",
    specialty: "",
    date: "",
    time: "",
    location: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setNewAppointment(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAppointment = () => {
    const appointment = {
      id: appointments.length + 1,
      ...newAppointment,
    };
    setAppointments(prev => [...prev, appointment]);
    setNewAppointment({ doctor: "", specialty: "", date: "", time: "", location: "" });
    setShowForm(false);
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
              <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
              <p className="text-muted-foreground">Manage your medical appointments</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Appointment
          </Button>
        </div>

        {/* Add Appointment Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>New Appointment</CardTitle>
              <CardDescription>Schedule a new medical appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="doctor">Doctor Name</Label>
                  <Input
                    id="doctor"
                    placeholder="Dr. Smith"
                    value={newAppointment.doctor}
                    onChange={(e) => handleInputChange("doctor", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    placeholder="Cardiologist"
                    value={newAppointment.specialty}
                    onChange={(e) => handleInputChange("specialty", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City Medical Center"
                  value={newAppointment.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddAppointment}>Save Appointment</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{appointment.doctor}</h3>
                    <p className="text-muted-foreground">{appointment.specialty}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {appointment.location}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;

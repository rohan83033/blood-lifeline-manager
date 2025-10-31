import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Request = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    contactPerson: "",
    phone: "",
    email: "",
    bloodGroup: "",
    units: "",
    urgency: "Normal",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hospitalName || !formData.contactPerson || !formData.phone || !formData.bloodGroup || !formData.units) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseInt(formData.units) < 1 || parseInt(formData.units) > 50) {
      toast.error("Units must be between 1 and 50");
      return;
    }

    try {
      const { error } = await supabase.from("blood_requests").insert({
        hospital_name: formData.hospitalName,
        blood_group: formData.bloodGroup as any,
        units_requested: parseInt(formData.units),
        urgency: formData.urgency,
        contact: formData.phone,
        status: "Pending"
      });

      if (error) throw error;

      toast.success("Blood request submitted successfully! Our team will contact you shortly.");
      setFormData({
        hospitalName: "",
        contactPerson: "",
        phone: "",
        email: "",
        bloodGroup: "",
        units: "",
        urgency: "Normal",
        reason: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl">Blood Request Form</CardTitle>
              <CardDescription>
                Submit a request for blood units. Our team will process your request within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital/Clinic Name *</Label>
                  <Input
                    id="hospitalName"
                    placeholder="City General Hospital"
                    value={formData.hospitalName}
                    onChange={(e) => handleChange("hospitalName", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      placeholder="Dr. Smith"
                      value={formData.contactPerson}
                      onChange={(e) => handleChange("contactPerson", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@hospital.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group Required *</Label>
                    <Select value={formData.bloodGroup} onValueChange={(value) => handleChange("bloodGroup", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+ (A Positive)</SelectItem>
                        <SelectItem value="A-">A- (A Negative)</SelectItem>
                        <SelectItem value="B+">B+ (B Positive)</SelectItem>
                        <SelectItem value="B-">B- (B Negative)</SelectItem>
                        <SelectItem value="AB+">AB+ (AB Positive)</SelectItem>
                        <SelectItem value="AB-">AB- (AB Negative)</SelectItem>
                        <SelectItem value="O+">O+ (O Positive)</SelectItem>
                        <SelectItem value="O-">O- (O Negative)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="units">Number of Units *</Label>
                    <Input
                      id="units"
                      type="number"
                      placeholder="5"
                      min="1"
                      max="50"
                      value={formData.units}
                      onChange={(e) => handleChange("units", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level *</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleChange("urgency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emergency">Emergency (Within 2 hours)</SelectItem>
                      <SelectItem value="Urgent">Urgent (Within 24 hours)</SelectItem>
                      <SelectItem value="Normal">Normal (Within 3-5 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Request</Label>
                  <Textarea
                    id="reason"
                    placeholder="Briefly describe the medical situation..."
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Submit Blood Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Request;

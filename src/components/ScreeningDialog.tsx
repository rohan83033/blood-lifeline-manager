import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ScreeningDialogProps {
  donorId: string;
  donorName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ScreeningDialog = ({ donorId, donorName, open, onClose, onSuccess }: ScreeningDialogProps) => {
  const [formData, setFormData] = useState({
    bloodPressure: "",
    hemoglobin: "",
    weight: "",
    temperature: "",
    pulse: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create screening record
      const { error: screeningError } = await supabase.from("screening_records").insert({
        donor_id: donorId,
        blood_pressure: formData.bloodPressure,
        hemoglobin: parseFloat(formData.hemoglobin),
        weight: parseFloat(formData.weight),
        temperature: parseFloat(formData.temperature),
        pulse: parseInt(formData.pulse),
        screening_result: "Passed",
        notes: formData.notes,
        screened_by: "Admin",
      });

      if (screeningError) throw screeningError;

      // Update donor status
      const { error: updateError } = await supabase
        .from("donors")
        .update({ status: "Ready for Collection" })
        .eq("id", donorId);

      if (updateError) throw updateError;

      toast.success("Screening completed successfully!");
      onSuccess();
      onClose();
      setFormData({ bloodPressure: "", hemoglobin: "", weight: "", temperature: "", pulse: "", notes: "" });
    } catch (error: any) {
      toast.error(error.message || "Screening failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Screening: {donorName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Blood Pressure</Label>
              <Input
                id="bloodPressure"
                placeholder="120/80"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
              <Input
                id="hemoglobin"
                type="number"
                step="0.1"
                placeholder="13.5"
                value={formData.hemoglobin}
                onChange={(e) => setFormData({ ...formData, hemoglobin: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="65"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°F)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="98.6"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pulse">Pulse (bpm)</Label>
              <Input
                id="pulse"
                type="number"
                placeholder="72"
                value={formData.pulse}
                onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional observations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Complete Screening</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface CollectBloodDialogProps {
  donorId: string;
  donorName: string;
  bloodGroup: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CollectBloodDialog = ({ donorId, donorName, bloodGroup, open, onClose, onSuccess }: CollectBloodDialogProps) => {
  const [quantity, setQuantity] = useState("450");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create donation record
      const { error: donationError } = await supabase.from("donations").insert({
        donor_id: donorId,
        blood_group: bloodGroup as any,
        quantity_ml: parseInt(quantity),
        status: "Success",
        notes: notes,
      });

      if (donationError) throw donationError;

      // Update donor status and last donation date
      const { error: updateError } = await supabase
        .from("donors")
        .update({ 
          status: "Donation Success",
          last_donation_date: new Date().toISOString()
        })
        .eq("id", donorId);

      if (updateError) throw updateError;

      toast.success("Blood collected successfully!");
      onSuccess();
      onClose();
      setQuantity("450");
      setNotes("");
    } catch (error: any) {
      toast.error(error.message || "Blood collection failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collect Blood: {donorName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Blood Group</Label>
            <Input value={bloodGroup} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (ml)</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any observations during collection..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Complete Collection</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

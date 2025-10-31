import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface DonorCheckInProps {
  donorId: string;
  donorName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DonorCheckIn = ({ donorId, donorName, open, onClose, onSuccess }: DonorCheckInProps) => {
  const handleCheckIn = async () => {
    try {
      const { error } = await supabase
        .from("donors")
        .update({ status: "In Screening Queue" })
        .eq("id", donorId);

      if (error) throw error;

      toast.success(`${donorName} checked in successfully!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Check-in failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check-In Donor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to check in <strong>{donorName}</strong>?</p>
          <p className="text-sm text-muted-foreground">
            The donor will be moved to the screening queue.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleCheckIn}>Confirm Check-In</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

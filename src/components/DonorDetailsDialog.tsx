import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

interface DonorDetailsDialogProps {
  donorId: string;
  open: boolean;
  onClose: () => void;
}

export const DonorDetailsDialog = ({ donorId, open, onClose }: DonorDetailsDialogProps) => {
  const [donor, setDonor] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [screenings, setScreenings] = useState<any[]>([]);

  useEffect(() => {
    if (open && donorId) {
      loadDonorDetails();
    }
  }, [open, donorId]);

  const loadDonorDetails = async () => {
    // Fetch donor
    const { data: donorData } = await supabase
      .from("donors")
      .select("*")
      .eq("id", donorId)
      .single();
    setDonor(donorData);

    // Fetch donations
    const { data: donationsData } = await supabase
      .from("donations")
      .select("*")
      .eq("donor_id", donorId)
      .order("donation_date", { ascending: false });
    setDonations(donationsData || []);

    // Fetch screenings
    const { data: screeningsData } = await supabase
      .from("screening_records")
      .select("*")
      .eq("donor_id", donorId)
      .order("screened_at", { ascending: false });
    setScreenings(screeningsData || []);
  };

  if (!donor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Donor Details: {donor.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="screenings">Screenings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{donor.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-medium">{donor.blood_group}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{donor.age}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{donor.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{donor.contact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{donor.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{donor.address || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>{donor.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Donation</p>
                <p className="font-medium">
                  {donor.last_donation_date 
                    ? new Date(donor.last_donation_date).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="donations" className="space-y-2">
            {donations.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No donation records found</p>
            ) : (
              donations.map((donation) => (
                <div key={donation.id} className="border rounded p-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{donation.quantity_ml}ml - {donation.blood_group}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(donation.donation_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={donation.status === "Success" ? "default" : "destructive"}>
                      {donation.status}
                    </Badge>
                  </div>
                  {donation.notes && <p className="text-sm mt-2">{donation.notes}</p>}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="screenings" className="space-y-2">
            {screenings.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No screening records found</p>
            ) : (
              screenings.map((screening) => (
                <div key={screening.id} className="border rounded p-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(screening.screened_at).toLocaleDateString()}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>BP: {screening.blood_pressure}</div>
                    <div>Hb: {screening.hemoglobin} g/dL</div>
                    <div>Weight: {screening.weight} kg</div>
                    <div>Temp: {screening.temperature}°F</div>
                    <div>Pulse: {screening.pulse} bpm</div>
                  </div>
                  {screening.notes && <p className="text-sm mt-2 text-muted-foreground">{screening.notes}</p>}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

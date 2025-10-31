import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import { Search, Filter, Users, Droplet, TrendingUp, Calendar, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DonorCheckIn } from "@/components/DonorCheckIn";
import { ScreeningDialog } from "@/components/ScreeningDialog";
import { CollectBloodDialog } from "@/components/CollectBloodDialog";
import { DonorDetailsDialog } from "@/components/DonorDetailsDialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [donors, setDonors] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDonors: 0,
    unitsAvailable: 0,
    monthlyDonations: 0,
    pendingRequests: 0,
  });
  
  const [checkInDialog, setCheckInDialog] = useState<{ open: boolean; donorId: string; donorName: string }>({ 
    open: false, donorId: "", donorName: "" 
  });
  const [screeningDialog, setScreeningDialog] = useState<{ open: boolean; donorId: string; donorName: string }>({ 
    open: false, donorId: "", donorName: "" 
  });
  const [collectDialog, setCollectDialog] = useState<{ 
    open: boolean; donorId: string; donorName: string; bloodGroup: string 
  }>({ 
    open: false, donorId: "", donorName: "", bloodGroup: "" 
  });
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; donorId: string }>({ 
    open: false, donorId: "" 
  });

  useEffect(() => {
    checkAuth();
    loadDonors();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const loadDonors = async () => {
    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setDonors(data);
  };

  const loadStats = async () => {
    const { data: donorsData } = await supabase.from("donors").select("id", { count: "exact" });
    const { data: inventoryData } = await supabase.from("blood_inventory").select("units_available");
    const { data: donationsData } = await supabase
      .from("donations")
      .select("id")
      .gte("donation_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
    const { data: requestsData } = await supabase
      .from("blood_requests")
      .select("id", { count: "exact" })
      .eq("status", "Pending");

    setStats({
      totalDonors: donorsData?.length || 0,
      unitsAvailable: inventoryData?.reduce((sum, item) => sum + item.units_available, 0) || 0,
      monthlyDonations: donationsData?.length || 0,
      pendingRequests: requestsData?.length || 0,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "Eligible": "default",
      "In Screening Queue": "secondary",
      "Not Eligible": "outline",
      "Permanently Defer": "destructive",
      "Ready for Collection": "default",
      "Donation Failed": "destructive",
      "Donation Success": "default",
    };
    return variants[status] || "default";
  };

  const getActionButton = (donor: any) => {
    if (donor.status === "Eligible") {
      return <Button size="sm" onClick={() => setCheckInDialog({ open: true, donorId: donor.id, donorName: donor.name })}>Check-In</Button>;
    }
    if (donor.status === "In Screening Queue") {
      return <Button size="sm" variant="secondary" onClick={() => setScreeningDialog({ open: true, donorId: donor.id, donorName: donor.name })}>Start Screening</Button>;
    }
    if (donor.status === "Ready for Collection") {
      return <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={() => setCollectDialog({ open: true, donorId: donor.id, donorName: donor.name, bloodGroup: donor.blood_group })}>Collect Blood</Button>;
    }
    if (donor.status === "Donation Success" || donor.status === "Donation Failed") {
      return <Button size="sm" variant="outline" onClick={() => setDetailsDialog({ open: true, donorId: donor.id })}>View Details</Button>;
    }
    return <Button size="sm" variant="outline" onClick={() => setDetailsDialog({ open: true, donorId: donor.id })}>View Details</Button>;
  };

  const filteredDonors = donors.filter(donor => 
    donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.contact.includes(searchQuery) ||
    donor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Logout Button */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDonors}</div>
              <p className="text-xs text-muted-foreground">Registered donors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Units Available</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unitsAvailable}</div>
              <p className="text-xs text-muted-foreground">All blood types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyDonations}</div>
              <p className="text-xs text-muted-foreground">Successful donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Donors Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>All Donors</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Name, Mobile No or Donor Id"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Last Checking</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donor.name}</div>
                          <div className="text-sm text-muted-foreground">{donor.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(donor.status)}>
                          {donor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{donor.gender}</TableCell>
                      <TableCell>{donor.blood_group}</TableCell>
                      <TableCell className="text-sm">
                        {donor.last_donation_date 
                          ? new Date(donor.last_donation_date).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        {getActionButton(donor)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <DonorCheckIn
        donorId={checkInDialog.donorId}
        donorName={checkInDialog.donorName}
        open={checkInDialog.open}
        onClose={() => setCheckInDialog({ open: false, donorId: "", donorName: "" })}
        onSuccess={() => { loadDonors(); loadStats(); }}
      />
      
      <ScreeningDialog
        donorId={screeningDialog.donorId}
        donorName={screeningDialog.donorName}
        open={screeningDialog.open}
        onClose={() => setScreeningDialog({ open: false, donorId: "", donorName: "" })}
        onSuccess={() => { loadDonors(); loadStats(); }}
      />
      
      <CollectBloodDialog
        donorId={collectDialog.donorId}
        donorName={collectDialog.donorName}
        bloodGroup={collectDialog.bloodGroup}
        open={collectDialog.open}
        onClose={() => setCollectDialog({ open: false, donorId: "", donorName: "", bloodGroup: "" })}
        onSuccess={() => { loadDonors(); loadStats(); }}
      />
      
      <DonorDetailsDialog
        donorId={detailsDialog.donorId}
        open={detailsDialog.open}
        onClose={() => setDetailsDialog({ open: false, donorId: "" })}
      />
    </div>
  );
};

export default Dashboard;

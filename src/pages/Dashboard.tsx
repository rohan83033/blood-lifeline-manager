import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import { Search, Filter, Users, Droplet, TrendingUp, Calendar } from "lucide-react";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const donors = [
    { id: "SB821-00046", name: "Jane Doe", status: "Eligible", gender: "M", bloodGroup: "B Rh Positive", lastChecking: "05 Sept, 2022 at 12:36 PM" },
    { id: "SB821-00046", name: "John Doe", status: "In Screening Queue", gender: "F", bloodGroup: "B Rh Positive", lastChecking: "05 Sept, 2022 at 12:36 PM" },
    { id: "SB821-00046", name: "Alex Doe", status: "Not Eligible", gender: "M", bloodGroup: "B Rh Positive", lastChecking: "05 Sept, 2022 at 12:36 PM" },
    { id: "SB821-00046", name: "Jane Smith", status: "Permanently Defer", gender: "M", bloodGroup: "B Rh Positive", lastChecking: "05 Sept, 2022 at 12:36 PM" },
    { id: "SB821-00046", name: "Alexander", status: "Ready for Collection", gender: "M", bloodGroup: "B Rh Positive", lastChecking: "05 Sept, 2022 at 12:36 PM" },
    { id: "SB821-00046", name: "Jubin Dew", status: "Donation Failed", gender: "M", bloodGroup: "B Rh Positive", lastChecking: "05 Sept, 2022 at 12:36 PM" },
    { id: "SB821-00046", name: "Martin", status: "Donation Success", gender: "M", bloodGroup: "B Rh Positive", lastChecking: "05 Sept, 2022 at 12:36 PM" },
    { id: "SB821-00046", name: "Alex Smith", status: "In Screening Queue", gender: "M", bloodGroup: "B Rh Positive", lastChecking: "05 Sept, 2022 at 12:36 PM" },
  ];

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

  const getActionButton = (status: string) => {
    if (status === "Eligible") return <Button size="sm">Check-In</Button>;
    if (status === "In Screening Queue") return <Button size="sm" variant="secondary">Start Screening</Button>;
    if (status === "Ready for Collection") return <Button size="sm" className="bg-accent hover:bg-accent/90">Collect Blood</Button>;
    if (status === "Donation Success" || status === "Donation Failed") return <Button size="sm" variant="outline">View Details</Button>;
    return <Button size="sm" variant="outline">Check-In</Button>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,420</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Units Available</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,240</div>
              <p className="text-xs text-muted-foreground">All blood types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-muted-foreground">Successful donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
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
                  {donors.map((donor, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donor.name}</div>
                          <div className="text-sm text-muted-foreground">{donor.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(donor.status)}>
                          {donor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{donor.gender}</TableCell>
                      <TableCell>{donor.bloodGroup}</TableCell>
                      <TableCell className="text-sm">{donor.lastChecking}</TableCell>
                      <TableCell>
                        {getActionButton(donor.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

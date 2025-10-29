import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import { Droplet, AlertTriangle } from "lucide-react";

const Inventory = () => {
  const bloodStock = [
    { type: "A+", units: 45, total: 100, percentage: 45 },
    { type: "A-", units: 12, total: 50, percentage: 24 },
    { type: "B+", units: 67, total: 100, percentage: 67 },
    { type: "B-", units: 8, total: 50, percentage: 16 },
    { type: "AB+", units: 23, total: 50, percentage: 46 },
    { type: "AB-", units: 5, total: 30, percentage: 17 },
    { type: "O+", units: 89, total: 120, percentage: 74 },
    { type: "O-", units: 15, total: 60, percentage: 25 },
  ];

  const getStockStatus = (percentage: number) => {
    if (percentage < 20) return { color: "bg-destructive", status: "Critical" };
    if (percentage < 40) return { color: "bg-warning", status: "Low" };
    return { color: "bg-success", status: "Good" };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Blood Inventory</h1>
          <p className="text-muted-foreground">Current blood stock levels across all blood types</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {bloodStock.map((blood) => {
            const status = getStockStatus(blood.percentage);
            return (
              <Card key={blood.type} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Droplet className="h-6 w-6 text-accent" />
                      {blood.type}
                    </CardTitle>
                    {blood.percentage < 30 && (
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-foreground">{blood.units}</span>
                      <span className="text-sm text-muted-foreground">/ {blood.total} units</span>
                    </div>
                    <Progress value={blood.percentage} className="h-2" />
                    <div className="flex justify-between items-center text-sm">
                      <span className={`font-medium ${
                        blood.percentage < 20 ? 'text-destructive' : 
                        blood.percentage < 40 ? 'text-warning' : 
                        'text-success'
                      }`}>
                        {status.status}
                      </span>
                      <span className="text-muted-foreground">{blood.percentage}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <div className="font-semibold text-foreground">Critical Stock Alert</div>
                    <div className="text-sm text-muted-foreground">
                      3 blood types are below 20% capacity
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-destructive">3</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-card rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Total Units</div>
                  <div className="text-2xl font-bold text-foreground">264</div>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Available Capacity</div>
                  <div className="text-2xl font-bold text-foreground">560</div>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Utilization</div>
                  <div className="text-2xl font-bold text-foreground">47%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Droplet, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";

const Inventory = () => {
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const { data } = await supabase
      .from("blood_inventory")
      .select("*")
      .order("blood_group");
    
    if (data) setInventory(data);
  };

  const getStatusBadge = (units: number) => {
    if (units < 10) return <Badge variant="destructive">Critical</Badge>;
    if (units < 20) return <Badge className="bg-warning text-warning-foreground">Low</Badge>;
    return <Badge className="bg-success text-success-foreground">Normal</Badge>;
  };

  const getStatus = (units: number) => {
    if (units < 10) return "critical";
    if (units < 20) return "low";
    return "normal";
  };

  const totalUnits = inventory.reduce((sum, item) => sum + item.units_available, 0);
  const criticalCount = inventory.filter(item => item.units_available < 10).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Blood Inventory</h1>
          <p className="text-muted-foreground">Current blood stock levels across all blood types</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {inventory.map((item) => {
            const percentage = Math.min(100, (item.units_available / 100) * 100);
            return (
              <Card key={item.blood_group} className={`border-2 ${
                getStatus(item.units_available) === "critical" ? "border-destructive" :
                getStatus(item.units_available) === "low" ? "border-warning" : "border-border"
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Droplet className="h-6 w-6 text-accent" />
                      {item.blood_group}
                    </CardTitle>
                    {item.units_available < 30 && (
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-foreground">{item.units_available}</span>
                      <span className="text-sm text-muted-foreground">units</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between items-center text-sm">
                      {getStatusBadge(item.units_available)}
                      <span className="text-muted-foreground">
                        Updated: {new Date(item.last_updated).toLocaleDateString()}
                      </span>
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
              {criticalCount > 0 && (
                <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <div className="font-semibold text-foreground">Critical Stock Alert</div>
                      <div className="text-sm text-muted-foreground">
                        {criticalCount} blood type{criticalCount > 1 ? 's are' : ' is'} below 10 units
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-card rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Total Units</div>
                  <div className="text-2xl font-bold text-foreground">{totalUnits}</div>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Blood Types</div>
                  <div className="text-2xl font-bold text-foreground">{inventory.length}</div>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Average Stock</div>
                  <div className="text-2xl font-bold text-foreground">
                    {inventory.length > 0 ? Math.round(totalUnits / inventory.length) : 0}
                  </div>
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

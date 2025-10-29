import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Shield, Building2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [hospitalCredentials, setHospitalCredentials] = useState({ username: "", password: "" });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminCredentials.username || !adminCredentials.password) {
      toast.error("Please enter both username and password");
      return;
    }

    // Demo credentials
    if (adminCredentials.username === "admin" && adminCredentials.password === "admin123") {
      toast.success("Welcome back, Administrator!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleHospitalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hospitalCredentials.username || !hospitalCredentials.password) {
      toast.error("Please enter both username and password");
      return;
    }

    // Demo credentials
    if (hospitalCredentials.username === "hospital" && hospitalCredentials.password === "hosp123") {
      toast.success("Welcome back, Hospital Staff!");
      setTimeout(() => navigate("/request"), 1000);
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Login</CardTitle>
              <CardDescription>
                Access your dashboard to manage blood donations and requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="admin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="admin">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </TabsTrigger>
                  <TabsTrigger value="hospital">
                    <Building2 className="h-4 w-4 mr-2" />
                    Hospital
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="admin" className="space-y-4">
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username">Username</Label>
                      <Input
                        id="admin-username"
                        placeholder="Enter admin username"
                        value={adminCredentials.username}
                        onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter password"
                        value={adminCredentials.password}
                        onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Login as Admin
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Demo: admin / admin123
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="hospital" className="space-y-4">
                  <form onSubmit={handleHospitalLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hospital-username">Hospital ID</Label>
                      <Input
                        id="hospital-username"
                        placeholder="Enter hospital ID"
                        value={hospitalCredentials.username}
                        onChange={(e) => setHospitalCredentials(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospital-password">Password</Label>
                      <Input
                        id="hospital-password"
                        type="password"
                        placeholder="Enter password"
                        value={hospitalCredentials.password}
                        onChange={(e) => setHospitalCredentials(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Login as Hospital
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Demo: hospital / hosp123
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

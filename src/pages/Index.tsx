import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Droplet, Heart, Users, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Save Lives Through
              <span className="text-primary"> Blood Donation</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Join our community of donors and help us maintain a healthy blood supply for those in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  <Droplet className="mr-2 h-5 w-5" />
                  Register as Donor
                </Button>
              </Link>
              <Link to="/request">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Request Blood
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">5,420</div>
                  <div className="text-sm text-muted-foreground">Active Donors</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Droplet className="h-10 w-10 text-accent mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">12,350</div>
                  <div className="text-sm text-muted-foreground">Lives Saved</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Heart className="h-10 w-10 text-success mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-10 w-10 text-info mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Your Donation Matters
            </h2>
            <p className="text-muted-foreground">
              Every donation can save up to three lives. Join thousands of donors making a difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Save Lives</h3>
              <p className="text-muted-foreground">
                One donation can help patients in surgery, cancer treatment, and emergencies.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Join Community</h3>
              <p className="text-muted-foreground">
                Be part of a caring community dedicated to helping those in medical need.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplet className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Regular Updates</h3>
              <p className="text-muted-foreground">
                Track your donations and receive notifications when you're eligible to donate again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Register today and become a lifesaver in your community.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 BloodBank+. Saving lives, one donation at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

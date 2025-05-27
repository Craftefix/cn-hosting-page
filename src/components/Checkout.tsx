
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, User, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Addon {
  id: string;
  title: string;
  description: string;
  setupPrice: number;
  monthlyPrice: number;
}

const Checkout = () => {
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    discord: '',
    serverName: '',
    playerCount: 30
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedAddons = sessionStorage.getItem('selectedAddons');
    if (storedAddons) {
      setSelectedAddons(JSON.parse(storedAddons));
    }
  }, []);

  const calculateTotals = () => {
    const basePrice = 13 + (customerInfo.playerCount * 0.85); // Base server cost
    const addonSetup = selectedAddons.reduce((sum, addon) => sum + addon.setupPrice, 0);
    const addonMonthly = selectedAddons.reduce((sum, addon) => sum + addon.monthlyPrice, 0);
    
    return {
      basePrice: basePrice.toFixed(2),
      addonSetup,
      addonMonthly,
      totalMonthly: (basePrice + addonMonthly).toFixed(2),
      totalSetup: addonSetup
    };
  };

  const totals = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Send order details to Discord webhook
      const orderData = {
        customer: customerInfo,
        addons: selectedAddons,
        pricing: totals,
        timestamp: new Date().toISOString()
      };

      // Here you would normally create a Stripe checkout session
      // For now, we'll simulate the process and send to Discord
      
      toast({
        title: "Order Submitted!",
        description: "We'll contact you shortly to set up your server and process payment.",
      });

      console.log('Order submitted:', orderData);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Complete Your <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Order</span>
          </h1>
          <p className="text-gray-400 text-lg">Get your Minecraft server setup started today</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <Card className="bg-gray-800 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-green-400" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="discord" className="text-gray-300">Discord Username</Label>
                <Input
                  id="discord"
                  value={customerInfo.discord}
                  onChange={(e) => setCustomerInfo({...customerInfo, discord: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="username#1234"
                />
              </div>

              <div>
                <Label htmlFor="serverName" className="text-gray-300">Server Name</Label>
                <Input
                  id="serverName"
                  value={customerInfo.serverName}
                  onChange={(e) => setCustomerInfo({...customerInfo, serverName: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="My Awesome Server"
                />
              </div>

              <div>
                <Label htmlFor="playerCount" className="text-gray-300">Expected Player Count</Label>
                <Input
                  id="playerCount"
                  type="number"
                  min="5"
                  max="200"
                  value={customerInfo.playerCount}
                  onChange={(e) => setCustomerInfo({...customerInfo, playerCount: parseInt(e.target.value) || 30})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-gray-800 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-400" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Base Server */}
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <div>
                  <p className="text-white font-medium">Base Server ({customerInfo.playerCount} players)</p>
                  <p className="text-gray-400 text-sm">Complete setup & management</p>
                </div>
                <p className="text-green-400 font-bold">€{totals.basePrice}/month</p>
              </div>

              {/* Selected Add-ons */}
              {selectedAddons.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <div>
                    <p className="text-white font-medium">{addon.title}</p>
                    <p className="text-gray-400 text-sm">{addon.description}</p>
                  </div>
                  <div className="text-right">
                    {addon.setupPrice > 0 && (
                      <p className="text-yellow-400 text-sm">€{addon.setupPrice} setup</p>
                    )}
                    <p className="text-green-400 font-bold">€{addon.monthlyPrice}/month</p>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="pt-4 space-y-2">
                {totals.totalSetup > 0 && (
                  <div className="flex justify-between text-yellow-400">
                    <span>One-time Setup Fee:</span>
                    <span className="font-bold">€{totals.totalSetup}</span>
                  </div>
                )}
                <div className="flex justify-between text-green-400 text-lg font-bold">
                  <span>Monthly Total:</span>
                  <span>€{totals.totalMonthly}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="pt-6">
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4"
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Submit Order & Get Quote
                    </>
                  )}
                </Button>
              </form>

              <p className="text-gray-400 text-sm text-center">
                We'll contact you within 24 hours to set up payment and begin your server setup.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


import { useState } from "react";
import { Menu, RefreshCw, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface DashboardContentProps {
  user: any;
  subscription: any;
  billingHistory: any[];
  onDataRefresh: () => void;
  onMenuClick: () => void;
}

const DashboardContent = ({ 
  user, 
  subscription, 
  billingHistory, 
  onDataRefresh, 
  onMenuClick 
}: DashboardContentProps) => {
  const [playerCount, setPlayerCount] = useState([subscription?.player_count || 30]);
  const [loading, setLoading] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const { toast } = useToast();

  const availableAddons = [
    { id: 'website', title: "Website", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
    { id: 'ranks', title: "In-Game Ranks & Economy", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
    { id: 'antiCheat', title: "Anti-Cheat Setup", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
    { id: 'antixray', title: "Anti-Xray", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
    { id: 'webstore', title: "Webstore", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
    { id: 'analytics', title: "Player Analytics Dashboard", setupPrice: 8, monthlyPrice: 4, setupRefundDays: 2, monthlyRefundDays: 7 }
  ];

  const getBaseServerCharge = (players: number) => {
    if (players <= 5) return 6;
    if (players <= 10) return 7;
    if (players <= 15) return 8;
    if (players <= 20) return 10;
    if (players <= 25) return 11;
    if (players <= 30) return 12;
    if (players <= 50) return 15;
    if (players <= 75) return 19;
    if (players <= 100) return 23;
    if (players <= 150) return 27;
    return 32;
  };

  const calculatePrice = (players: number) => {
    const baseCharge = getBaseServerCharge(players);
    const playerCost = players * 0.85;
    const addonCost = selectedAddons.reduce((sum, addonId) => {
      const addon = availableAddons.find(a => a.id === addonId);
      return sum + (addon?.monthlyPrice || 0);
    }, 0);
    return (baseCharge + playerCost + addonCost).toFixed(2);
  };

  const getNextBillingDate = () => {
    if (!subscription) return null;
    return new Date(subscription.current_period_end);
  };

  const handleCreateCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: {
          playerCount: playerCount[0],
          selectedAddons,
          billingDay: new Date().getDate()
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = async (billingId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('request-refund', {
        body: {
          billingHistoryId: billingId,
          reason: "Customer requested refund"
        }
      });

      if (error) throw error;

      toast({
        title: "Refund Requested",
        description: data.message || "Your refund request has been submitted",
      });

      onDataRefresh();
    } catch (error: any) {
      toast({
        title: "Refund Error",
        description: error.message || "Failed to process refund request",
        variant: "destructive",
      });
    }
  };

  const isRefundEligible = (billingRecord: any) => {
    const chargedAt = new Date(billingRecord.charged_at);
    const now = new Date();
    const daysSinceCharge = Math.floor((now.getTime() - chargedAt.getTime()) / (1000 * 60 * 60 * 24));
    
    let refundWindowDays = 0;
    switch (billingRecord.charge_type) {
      case "subscription": refundWindowDays = 14; break;
      case "addon_setup": refundWindowDays = 2; break;
      case "addon_monthly": refundWindowDays = 7; break;
    }

    return daysSinceCharge <= refundWindowDays && !billingRecord.refunded_at;
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={onDataRefresh}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <span className="text-gray-400 text-sm">Welcome, {user.email}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Current Subscription */}
        {subscription && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-400" />
                <span>Current Subscription</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Player Count</div>
                  <div className="text-2xl font-bold text-green-400">{subscription.player_count}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Monthly Cost</div>
                  <div className="text-2xl font-bold text-white">€{subscription.total_monthly}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Next Billing</div>
                  <div className="text-lg text-white">
                    {getNextBillingDate()?.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {subscription.subscription_addons?.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-400 mb-2">Active Add-ons</div>
                  <div className="space-y-1">
                    {subscription.subscription_addons.map((addon: any) => (
                      <div key={addon.id} className="text-sm">
                        {addon.title} - €{addon.monthly_fee}/month
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Plan Configuration */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Configure Your Plan</CardTitle>
            <CardDescription className="text-gray-400">
              Changes will take effect on your next billing cycle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Player Count Slider */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-gray-300 font-medium">Player Count</label>
                <span className="text-green-400 font-bold text-lg">{playerCount[0]} players</span>
              </div>
              <Slider
                value={playerCount}
                onValueChange={setPlayerCount}
                max={200}
                min={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-gray-500 text-sm mt-2">
                <span>5</span>
                <span>200</span>
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <h4 className="text-white font-medium mb-4">Optional Add-ons</h4>
              <div className="space-y-3">
                {availableAddons.map((addon) => (
                  <div key={addon.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAddons([...selectedAddons, addon.id]);
                            } else {
                              setSelectedAddons(selectedAddons.filter(id => id !== addon.id));
                            }
                          }}
                          className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-white font-medium">{addon.title}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">
                          €{addon.setupPrice} setup + €{addon.monthlyPrice}/month
                        </div>
                        <div className="text-xs text-gray-400">
                          Setup refundable {addon.setupRefundDays} days, Monthly {addon.monthlyRefundDays} days
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-white font-medium mb-2">New Plan Summary</div>
              <div className="text-3xl font-bold text-green-400">
                €{calculatePrice(playerCount[0])}/month
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Changes take effect next billing cycle
              </div>
            </div>

            <Button 
              onClick={handleCreateCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {loading ? "Creating Checkout..." : subscription ? "Update Subscription" : "Start Subscription"}
            </Button>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-green-400" />
              <span>Billing History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {billingHistory.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No billing history available
              </div>
            ) : (
              <div className="space-y-4">
                {billingHistory.map((record) => (
                  <div key={record.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{record.description}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(record.charged_at).toLocaleDateString()}
                        </div>
                        {record.refunded_at && (
                          <div className="text-sm text-green-400 flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>Refunded on {new Date(record.refunded_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">€{record.amount}</div>
                        {isRefundEligible(record) && (
                          <Button
                            onClick={() => handleRefundRequest(record.id)}
                            variant="outline"
                            size="sm"
                            className="mt-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            Request Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardContent;

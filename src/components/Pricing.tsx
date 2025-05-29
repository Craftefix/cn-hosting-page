
import { Users, ShoppingCart, Globe, Shield, Database, TrendingUp, Gamepad2, Eye } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";

const Pricing = () => {
  const [playerCount, setPlayerCount] = useState([30]);
  const [selectedAddons, setSelectedAddons] = useState<{[key: string]: boolean}>({
    website: false,
		ranks: false,
		antiCheat: false,
		antixray: false,
		webstore: false,
		analytics: false
  });

  const availableAddons = [
    {
      id: 'website',
      description: "Server status, player stats, join button, customizable homepage",
      icon: <Globe className="w-5 h-5 text-green-400" />,
      monthlyPrice: 6,
      setupPrice: 12,
      title: "Website",
    },
    {
      id: 'ranks',
      description: "Ranks, Shop(s) and virtual currency of your choice",
      icon: <Gamepad2 className="w-5 h-5 text-green-400" />,
      monthlyPrice: 6,
      setupPrice: 12,
      title: "In-Game Ranks, Shop & Economy",
    },
    {
      id: 'antiCheat',
      description: "Preinstalled and configured advanced anti-cheat plugins",
      icon: <Shield className="w-5 h-5 text-green-400" />,
      monthlyPrice: 6,
      setupPrice: 12,
      title: "Anti-Cheat Setup",
    },
    {
      id: 'antixray',
      description: "Uses the most effective AI and ML techniques to prevent X-Ray",
      icon: <Eye className="w-5 h-5 text-green-400" />,
      monthlyPrice: 6,
      setupPrice: 12,
      title: "Anti-Xray",
    },
    {
      id: 'webstore',
      description: 'Sell items, ranks, and perks with integrated payment processing.',
      icon: <ShoppingCart className="w-5 h-5" />,
      monthlyPrice: 6,
      setupPrice: 12,
      title: 'Webstore',
    },
    {
      id: 'analytics',
      description: 'Web-based insights on playtime, activity, and trends',
      icon: <TrendingUp className="w-5 h-5" />,
      monthlyPrice: 4,
      setupPrice: 8,
      title: 'Player Analytics Dashboard',
    }
  ];

  const getBaseServerCharge = (players: number) => {
    // Smooth curve for server base cost
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
    return 32; // 200+ players
  };

  const calculatePrice = (players: number) => {
    const baseCharge = getBaseServerCharge(players);
    const playerCost = players * 0.85;
    const addonCost = Object.entries(selectedAddons)
      .filter(([_, selected]) => selected)
      .reduce((sum, [addonId]) => {
        const addon = availableAddons.find(a => a.id === addonId);
        return sum + (addon?.monthlyPrice || 0);
      }, 0);
    return (baseCharge + playerCost + addonCost).toFixed(2);
  };

  const calculateSetupFee = () => {
    return Object.entries(selectedAddons)
      .filter(([_, selected]) => selected)
      .reduce((sum, [addonId]) => {
        const addon = availableAddons.find(a => a.id === addonId);
        return sum + (addon?.setupPrice || 0);
      }, 0);
  };

  const calculateActualPlayerSlots = (basePlayerCount: number) => {
    let bonusPercentage = 0;
    
    // Smooth curve for bonus percentage
    if (basePlayerCount >= 200) {
      bonusPercentage = 0.15; // 15% bonus
    } else if (basePlayerCount >= 150) {
      bonusPercentage = 0.12; // 12% bonus
    } else if (basePlayerCount >= 100) {
      bonusPercentage = 0.10; // 10% bonus
    } else if (basePlayerCount >= 75) {
      bonusPercentage = 0.08; // 8% bonus
    } else if (basePlayerCount >= 50) {
      bonusPercentage = 0.05; // 5% bonus
    } else if (basePlayerCount >= 30) {
      bonusPercentage = 0.03; // 3% bonus
    } else if (basePlayerCount >= 20) {
      bonusPercentage = 0.02; // 2% bonus
    } else if (basePlayerCount >= 10) {
      bonusPercentage = 0.01; // 1% bonus
    }
    
    const additionalSlots = Math.floor(basePlayerCount * bonusPercentage);
    return basePlayerCount + additionalSlots;
  };

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonId]: !prev[addonId]
    }));
  };

  const handleStartPlan = () => {
    const selectedAddonsList = Object.entries(selectedAddons)
      .filter(([_, selected]) => selected)
      .map(([addonId]) => availableAddons.find(a => a.id === addonId))
      .filter(Boolean);
  };

  const currentPrice = calculatePrice(playerCount[0]);
  const setupFee = calculateSetupFee();
  const actualSlots = calculateActualPlayerSlots(playerCount[0]);
  const bonusSlots = actualSlots - playerCount[0];
  const baseCharge = getBaseServerCharge(playerCount[0]);
  const playerCost = (playerCount[0] * 0.85).toFixed(2);

  const getBonusPercentage = (players: number) => {
    if (players >= 200) return "15% bonus slots";
    if (players >= 150) return "12% bonus slots";
    if (players >= 100) return "10% bonus slots";
    if (players >= 75) return "8% bonus slots";
    if (players >= 50) return "5% bonus slots";
    if (players >= 30) return "3% bonus slots";
    if (players >= 20) return "2% bonus slots";
    if (players >= 10) return "1% bonus slots";
    return "";
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Choose the perfect plan for your server with CraftNet hosting. All plans include our full management service with no hidden fees.
          </p>

          {/* Custom Pricing Slider */}
          <div className="max-w-2xl mx-auto mb-16 bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Custom Plan Calculator</h3>
            <div className="space-y-6">
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


              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-gray-300">Total Player Slots</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {playerCount[0]}
                    {bonusSlots > 0 && (
                      <span className="text-green-400 text-lg ml-2">
                        (+{bonusSlots})
                      </span>
                    )}
                  </div>
                  {bonusSlots > 0 && (
                    <p className="text-gray-400 text-sm mt-1">
                      {getBonusPercentage(playerCount[0])}
                    </p>
                  )}
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-gray-300">Monthly Cost</span>
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    €{currentPrice}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    <div>€{baseCharge} base server + €{playerCost} players</div>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
            <div className="space-y-4">
                 <h4 className="text-white font-medium">Optional Add-ons</h4>
                 {availableAddons.map((addon) => (
                      <div key={addon.id} className="bg-gray-700/30 rounded-xl p-4">
                           <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                     <Toggle
                                          pressed={selectedAddons[addon.id]}
                                          onPressedChange={() => handleAddonToggle(addon.id)}
                                          size="default"
                                          variant="outline"
                                     >
                                          <div className="flex items-center space-x-2">
                                               <div className="text-green-400">{addon.icon}</div>
                                               <span className="text-white font-medium">
                                                    {addon.title}
                                                </span>
                                          </div>
                                     </Toggle>
                                </div>
                                <div className="text-right">
                                     <div className="text-green-400 font-bold">
                                          {addon.setupPrice > 0 && `€${addon.setupPrice} setup + `}€{addon.monthlyPrice}/month
                                     </div>
                               </div>
                            </div>
                           {selectedAddons[addon.id] && (
                                <div className="mt-3 text-gray-400 text-sm">
                                     {addon.description}
                                </div>
                             )}
                      </div>
                 ))}
            </div>


              <button 
                onClick={handleStartPlan}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:from-green-600 hover:to-emerald-700"
              >
                Start Your Custom Plan - €{currentPrice}/month
                {setupFee > 0 && <span className="text-sm font-normal"> (+ €{setupFee} setup)</span>}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">
            All plans include a 7-day money-back guarantee
          </p>
          <p className="text-gray-500 text-sm">
            Need a custom solution? <a href="#contact" className="text-green-400 hover:text-green-300">Contact us</a> for enterprise pricing
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

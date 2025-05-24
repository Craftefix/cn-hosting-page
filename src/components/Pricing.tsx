
import { Check, Star, Users } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const Pricing = () => {
  const [playerCount, setPlayerCount] = useState([30]);
  const [additionalServices, setAdditionalServices] = useState({
    prioritySupport: false,
    customPlugins: false,
    backupStorage: false,
    ddosProtection: false,
    dedicatedIP: false
  });

  const calculatePrice = (players: number) => {
    return (players * 0.75).toFixed(2);
  };

  const calculateActualPlayerSlots = (basePlayerCount: number) => {
    let additionalSlots = 0;
    
    if (basePlayerCount >= 100) {
      // 10% additional from 100 players onwards
      additionalSlots = Math.floor(basePlayerCount * 0.10);
    } else if (basePlayerCount >= 50) {
      // 3% additional from 50 players onwards
      additionalSlots = Math.floor(basePlayerCount * 0.03);
    } else if (basePlayerCount >= 30) {
      // 2% additional from 30 players onwards
      additionalSlots = Math.floor(basePlayerCount * 0.02);
    }
    
    return basePlayerCount + additionalSlots;
  };

  const calculateAdditionalServicesCost = () => {
    let cost = 0;
    if (additionalServices.prioritySupport) cost += 15;
    if (additionalServices.customPlugins) cost += 25;
    if (additionalServices.backupStorage) cost += 10;
    if (additionalServices.ddosProtection) cost += 20;
    if (additionalServices.dedicatedIP) cost += 5;
    return cost;
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setAdditionalServices(prev => ({
      ...prev,
      [service]: checked
    }));
  };

  const currentPrice = calculatePrice(playerCount[0]);
  const actualSlots = calculateActualPlayerSlots(playerCount[0]);
  const bonusSlots = actualSlots - playerCount[0];
  const additionalServicesCost = calculateAdditionalServicesCost();
  const totalCost = (parseFloat(currentPrice) + additionalServicesCost).toFixed(2);

  const getBonusPercentage = (players: number) => {
    if (players >= 100) return "10% bonus slots";
    if (players >= 50) return "3% bonus slots";
    if (players >= 30) return "2% bonus slots";
    return "";
  };

  const additionalServicesOptions = [
    { id: "prioritySupport", label: "Priority Support (24/7)", cost: 15 },
    { id: "customPlugins", label: "Custom Plugin Development", cost: 25 },
    { id: "backupStorage", label: "Extended Backup Storage", cost: 10 },
    { id: "ddosProtection", label: "Advanced DDoS Protection", cost: 20 },
    { id: "dedicatedIP", label: "Dedicated IP Address", cost: 5 }
  ];

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
                    €{totalCost}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    €0.75 per player
                    {additionalServicesCost > 0 && (
                      <span className="block">+ €{additionalServicesCost} services</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Additional Services */}
              <div className="bg-gray-700/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Additional Services</h4>
                <div className="space-y-3">
                  {additionalServicesOptions.map((service) => (
                    <div key={service.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={service.id}
                          checked={additionalServices[service.id as keyof typeof additionalServices]}
                          onCheckedChange={(checked) => handleServiceChange(service.id, checked === true)}
                        />
                        <label htmlFor={service.id} className="text-gray-300 cursor-pointer">
                          {service.label}
                        </label>
                      </div>
                      <span className="text-green-400 font-medium">+€{service.cost}/month</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:from-green-600 hover:to-emerald-700">
                Start Your Custom Plan - €{totalCost}/month
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

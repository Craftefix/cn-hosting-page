
import { CheckCircle, Settings, Database, Shield, Headphones, Cpu, ShoppingCart, Globe, TrendingUp, Eye, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const Services = () => {
  const [addons, setAddons] = useState({
    completeSetup: false,
    freeWebsite: false,
    ranksEconomy: false,
    antiCheat: false,
    antiXray: false,
    performance: false,
    pluginManagement: false,
    webstore: false,
    analytics: false,
    dailyBackups: false
  });

  const availableAddons = [
    {
      id: 'completeSetup',
      title: 'Complete Server Setup',
      description: 'Professional installation and configuration of your Minecraft server with optimal settings',
      setupPrice: 25,
      monthlyPrice: 0,
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 'freeWebsite',
      title: 'Free Website',
      description: 'Server status, player stats, join button, customizable homepage',
      setupPrice: 15,
      monthlyPrice: 5,
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 'ranksEconomy',
      title: 'In-Game Ranks & Economy',
      description: 'Built-in rank ladder and virtual currency system. Works without webshop',
      setupPrice: 20,
      monthlyPrice: 8,
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'antiCheat',
      title: 'Anti-Cheat Setup',
      description: 'Preinstalled and configured advanced anti-cheat plugins',
      setupPrice: 10,
      monthlyPrice: 3,
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'antiXray',
      title: 'Anti-Xray Protection',
      description: 'Uses the most effective solution available (e.g., Paper Engine Mode 2)',
      setupPrice: 8,
      monthlyPrice: 2,
      icon: <Eye className="w-5 h-5" />
    },
    {
      id: 'performance',
      title: 'Performance Optimization',
      description: 'Server tuning and optimization with 24/7 monitoring for smooth gameplay',
      setupPrice: 15,
      monthlyPrice: 7,
      icon: <Cpu className="w-5 h-5" />
    },
    {
      id: 'pluginManagement',
      title: 'Plugin Management',
      description: 'Installation, configuration, and maintenance of plugins to enhance your server',
      setupPrice: 12,
      monthlyPrice: 5,
      icon: <Headphones className="w-5 h-5" />
    },
    {
      id: 'webstore',
      title: 'Webstore Integration',
      description: 'Sell items, ranks, and perks with integrated payment processing',
      setupPrice: 12,
      monthlyPrice: 6,
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      id: 'analytics',
      title: 'Player Analytics Dashboard',
      description: 'Web-based insights on playtime, activity, and trends',
      setupPrice: 8,
      monthlyPrice: 4,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: 'dailyBackups',
      title: 'Daily Backups',
      description: 'Automated daily backups with easy restore options',
      setupPrice: 0,
      monthlyPrice: 3,
      icon: <Database className="w-5 h-5" />
    }
  ];

  const handleAddonToggle = (addonId: string) => {
    setAddons(prev => ({
      ...prev,
      [addonId]: !prev[addonId as keyof typeof prev]
    }));
  };

  const calculateAddonCosts = () => {
    let totalSetup = 0;
    let totalMonthly = 0;
    
    availableAddons.forEach(addon => {
      if (addons[addon.id as keyof typeof addons]) {
        totalSetup += addon.setupPrice;
        totalMonthly += addon.monthlyPrice;
      }
    });
    
    return { totalSetup, totalMonthly };
  };

  const { totalSetup, totalMonthly } = calculateAddonCosts();

  return (
    <section id="services" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What We <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Manage</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose from our comprehensive suite of Minecraft server management services
          </p>
        </div>

        {/* Add-ons Section */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-8 max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Available Services & Add-ons
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {availableAddons.map((addon) => (
              <div key={addon.id} className="bg-gray-800/30 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-green-400">{addon.icon}</div>
                  <div>
                    <h4 className="text-white font-semibold">{addon.title}</h4>
                    <p className="text-gray-400 text-sm">{addon.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-green-400 font-bold">
                      {addon.setupPrice > 0 && `€${addon.setupPrice} setup`}
                      {addon.setupPrice > 0 && addon.monthlyPrice > 0 && ' + '}
                      {addon.monthlyPrice > 0 && `€${addon.monthlyPrice}/month`}
                      {addon.setupPrice === 0 && addon.monthlyPrice === 0 && 'Contact us'}
                    </div>
                  </div>
                  <Switch
                    checked={addons[addon.id as keyof typeof addons]}
                    onCheckedChange={() => handleAddonToggle(addon.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          {(totalSetup > 0 || totalMonthly > 0) && (
            <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
              <h4 className="text-white font-semibold mb-2">Selected Add-ons Total:</h4>
              <div className="text-green-400 font-bold text-lg">
                {totalSetup > 0 && `€${totalSetup} setup fee`}
                {totalSetup > 0 && totalMonthly > 0 && ' + '}
                {totalMonthly > 0 && `€${totalMonthly}/month additional`}
              </div>
              
              <button 
                className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  const selectedAddons = Object.entries(addons)
                    .filter(([_, selected]) => selected)
                    .map(([addonId]) => availableAddons.find(a => a.id === addonId))
                    .filter(Boolean);
                  
                  // Store selected addons in sessionStorage for the checkout page
                  sessionStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));
                  window.location.href = '/checkout';
                }}
              >
                Get Your Quote
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;

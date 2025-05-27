
import { CheckCircle, Settings, Database, Shield, Headphones, Cpu, ShoppingCart, Globe, TrendingUp, Eye, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const Services = () => {
  const [addons, setAddons] = useState({
    webstore: false,
    analytics: false,
    dailyBackups: false
  });

  const coreServices = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Complete Server Setup",
      description: "Professional installation and configuration of your Minecraft server with optimal settings"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Free Website",
      description: "Server status, player stats, join button, customizable homepage - included at no extra cost"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "In-Game Ranks & Economy",
      description: "Built-in rank ladder and virtual currency system. Works without webshop for seamless gameplay"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Anti-Cheat & Anti-Xray",
      description: "Preinstalled advanced anti-cheat plugins and AI-powered anti-xray protection"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Performance Optimization",
      description: "Server tuning and optimization with 24/7 monitoring for smooth gameplay"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Plugin Management",
      description: "Installation, configuration, and maintenance of plugins to enhance your server"
    }
  ];

  const availableAddons = [
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
            Everything you need for a professional Minecraft server, handled by experts so you can focus on your community
          </p>
        </div>

        {/* Core Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {coreServices.map((service, index) => (
            <div 
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 hover:transform hover:scale-105 animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-green-400 mb-4">{service.icon}</div>
              <h3 className="text-white font-bold text-xl mb-3">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-8 max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Optional Add-ons
          </h3>
          
          <div className="space-y-4 mb-6">
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
                      {addon.setupPrice > 0 && `€${addon.setupPrice} setup + `}€{addon.monthlyPrice}/month
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
                {totalSetup > 0 && `€${totalSetup} setup fee + `}€{totalMonthly}/month additional
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Go Hands-Free?
            </h3>
            <p className="text-gray-400 mb-6 text-lg">
              Join hundreds of server owners who trust us with their Minecraft communities
            </p>
            <button 
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
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
              Get Your Quote Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

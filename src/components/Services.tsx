
import { CheckCircle, Settings, Database, Shield, Headphones, Cpu } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Complete Server Setup",
      description: "Professional installation and configuration of your Minecraft server with optimal settings"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Automatic Backups",
      description: "Daily automated backups with easy restore options to protect your world and player data"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security Management",
      description: "Advanced protection against DDoS attacks, grief, and unauthorized access"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Performance Optimization",
      description: "Server tuning and optimization to ensure smooth gameplay for all players"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Plugin Management",
      description: "Installation, configuration, and maintenance of plugins to enhance your server"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "24/7 Monitoring",
      description: "Continuous monitoring with instant alerts and proactive issue resolution"
    }
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
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

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Go Hands-Free?
            </h3>
            <p className="text-gray-400 mb-6 text-lg">
              Join hundreds of server owners who trust us with their Minecraft communities
            </p>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105">
              Get Your Quote Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

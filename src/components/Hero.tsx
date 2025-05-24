
import { Server, Shield, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Minecraft Server,
              <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"> Perfectly Managed</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Focus on building your community while we handle all the technical stuff. 
              Professional server management with guaranteed uptime and expert support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Server Today
            </button>
            <button className="border-2 border-green-500 text-green-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-500 hover:text-white transition-all duration-300">
              View Pricing Plans
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <Server className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">24/7 Server Management</h3>
              <p className="text-gray-400">Complete hands-off management including updates, backups, and monitoring</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">99.9% Uptime Guarantee</h3>
              <p className="text-gray-400">Professional infrastructure with redundancy and instant issue resolution</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Expert Support</h3>
              <p className="text-gray-400">Direct access to experienced Minecraft server administrators</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

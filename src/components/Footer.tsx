import { Server, Mail, MessageCircle } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-green-500/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Logo />
              <span className="text-white font-bold text-xl">CraftNet Hosting</span>
            </div>
            <p className="text-gray-400 mb-4">
              Professional Minecraft server management for serious communities.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center hover:bg-green-500/30 transition-colors cursor-pointer">
                <Mail className="w-5 h-5 text-green-400" />
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center hover:bg-green-500/30 transition-colors cursor-pointer">
                <MessageCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-400 transition-colors">Server Setup</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">24/7 Management</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Plugin Installation</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Performance Optimization</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-400 transition-colors">Getting Started</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Status Page</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-500/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 CraftNet Hosting. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Built for Minecraft server owners who want to focus on their community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

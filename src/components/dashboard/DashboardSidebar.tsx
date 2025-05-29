
import { X, Home, CreditCard, Settings, LogOut, Server, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  subscription: any;
  onSignOut: () => void;
}

const DashboardSidebar = ({ open, setOpen, subscription, onSignOut }: DashboardSidebarProps) => {
  const menuItems = [
    { icon: Home, label: "Overview", active: true },
    { icon: Server, label: "Server Settings", active: false },
    { icon: Users, label: "Player Management", active: false },
    { icon: CreditCard, label: "Billing", active: false },
    { icon: Settings, label: "Account Settings", active: false },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700
        transform ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">CraftNet</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Subscription Status */}
        {subscription && (
          <div className="p-4 border-b border-gray-700">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400">Current Plan</div>
              <div className="text-green-400 font-semibold">
                {subscription.player_count} Players
              </div>
              <div className="text-xs text-gray-500 mt-1">
                €{subscription.total_monthly}/month
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                ${item.active 
                  ? "bg-green-600 text-white" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-700">
          <Button
            onClick={onSignOut}
            variant="ghost"
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;

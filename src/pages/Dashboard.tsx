
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import AuthPages from "@/components/dashboard/AuthPages";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        loadDashboardData(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadDashboardData(session.user);
        } else {
          setSubscription(null);
          setBillingHistory([]);
        }
      }
    );

    return () => authSubscription.unsubscribe();
  }, []);

  const loadDashboardData = async (user: any) => {
    try {
      // Load subscription data with addons
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select(`
          *,
          subscription_addons (*)
        `)
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (subError) {
        console.error("Error loading subscription:", subError);
      } else {
        setSubscription(subData);
      }

      // Load billing history
      const { data: billingData, error: billingError } = await supabase
        .from("billing_history")
        .select("*")
        .eq("user_id", user.id)
        .order("charged_at", { ascending: false });

      if (billingError) {
        console.error("Error loading billing history:", billingError);
      } else {
        setBillingHistory(billingData || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPages />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <DashboardSidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen}
        subscription={subscription}
        onSignOut={handleSignOut}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardContent 
          user={user}
          subscription={subscription}
          billingHistory={billingHistory}
          onDataRefresh={() => loadDashboardData(user)}
          onMenuClick={() => setSidebarOpen(true)}
        />
      </div>
    </div>
  );
};

export default Dashboard;

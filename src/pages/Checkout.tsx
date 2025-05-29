
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CheckoutPage = () => {
  const [orderData, setOrderData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get order data from session storage (from pricing page)
    const savedOrderData = sessionStorage.getItem('orderData');
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    } else {
      // If no order data, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleConfirmOrder = async () => {
    if (!orderData) return;

    try {
      // Here you would integrate with your payment system
      console.log('Processing order:', orderData);
      
      // Clear session storage
      sessionStorage.removeItem('orderData');
      
      // Show success message or redirect
      alert('Order submitted successfully! We will contact you shortly.');
      navigate('/');
    } catch (error) {
      console.error('Order submission error:', error);
      alert('There was an error submitting your order. Please try again.');
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Order Summary</CardTitle>
            <CardDescription className="text-gray-400">
              Review your custom Minecraft hosting configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Player Count:</span>
                <span className="text-white font-semibold">{orderData.playerCount} players</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Base Monthly Cost:</span>
                <span className="text-white">€{orderData.baseCost}</span>
              </div>

              {orderData.selectedAddons?.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Selected Add-ons:</h4>
                  {orderData.selectedAddons.map((addon: any) => (
                    <div key={addon.id} className="flex justify-between items-center ml-4">
                      <span className="text-gray-300">{addon.title}:</span>
                      <span className="text-white">€{addon.setupPrice} setup + €{addon.monthlyPrice}/month</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-white font-semibold">Total Monthly Cost:</span>
                  <span className="text-green-400 font-bold">€{orderData.totalCost}/month</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Back to Pricing
              </Button>
              <Button 
                onClick={handleConfirmOrder}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Confirm Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;

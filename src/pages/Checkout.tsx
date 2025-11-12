import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cash",
  });

  const subtotal = cart.reduce((sum: number, item: any) => 
    sum + (item.pricePerGram * item.quantity), 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create order
    const order = {
      id: Date.now().toString(),
      items: cart,
      customer: formData,
      total: subtotal,
      status: "Ordered",
      date: new Date().toISOString(),
    };
    
    // Save order
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Clear cart
    localStorage.setItem("cart", "[]");
    
    toast.success("Order placed successfully!");
    navigate("/orders");
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="cursor-pointer flex-1">
                          Cash on Delivery
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="cursor-pointer flex-1">
                          UPI Payment
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="cursor-pointer flex-1">
                          Online Payment (Coming Soon)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Place Order - ₹{subtotal.toFixed(0)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} ({item.quantity}g)</span>
                    <span className="font-medium">₹{(item.pricePerGram * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{subtotal.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  pricePerGram: number;
  image: string;
  quantity: number;
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 100) return;
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    updateCart(newCart);
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    updateCart(newCart);
    toast.success("Item removed from cart");
  };

  const applyCoupon = () => {
    const coupons = [
      { code: "WELCOME10", discount: 10, type: "percentage" },
      { code: "FESTIVE50", discount: 50, type: "flat" }
    ];
    
    const coupon = coupons.find(c => c.code === couponCode.toUpperCase());
    
    if (coupon) {
      if (coupon.type === "percentage") {
        setDiscount(subtotal * (coupon.discount / 100));
      } else {
        setDiscount(coupon.discount);
      }
      toast.success(`Coupon applied! You saved ₹${discount.toFixed(0)}`);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const subtotal = cart.reduce((sum, item) => 
    sum + (item.pricePerGram * item.quantity), 0
  );
  
  const total = Math.max(0, subtotal - discount);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto p-12 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding some delicious snacks to your cart!
            </p>
            <Link to="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-muted-foreground mb-3">
                      ₹{item.pricePerGram} per gram
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 50)}
                          disabled={item.quantity <= 100}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-4 font-medium">{item.quantity}g</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 50)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ₹{(item.pricePerGram * item.quantity).toFixed(0)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Have a coupon?</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button onClick={applyCoupon} variant="outline">
                    Apply
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;

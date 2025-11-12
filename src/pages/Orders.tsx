import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders.reverse()); // Most recent first
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ordered":
        return "bg-accent text-accent-foreground";
      case "Shipped":
        return "bg-primary text-primary-foreground";
      case "Delivered":
        return "bg-green-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto p-12 text-center">
            <Package className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="text-muted-foreground">
              Your order history will appear here once you place your first order.
            </p>
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
        <h1 className="text-4xl font-bold mb-8">Your Orders</h1>
        
        <div className="space-y-6 max-w-4xl">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order ID: {order.id}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}g × ₹{item.pricePerGram}/g
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{(item.pricePerGram * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <p>Delivering to: {order.customer.name}</p>
                    <p>{order.customer.address}, {order.customer.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{order.total.toFixed(0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Orders;

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import ProductDetailModal from "./ProductDetailModal";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    pricePerGram: number;
    images: string[];
    category: string;
    inStock: boolean;
    popular?: boolean;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Resolve image paths from data (which may reference `/assets/name.jpg`) to
  // actual module URLs for assets inside `src/assets` (most assets are PNGs).
  const resolvedImages = product.images.map((img) => {
    // extract base filename without extension, e.g. 'murukku' from '/assets/murukku.jpg'
    const parts = img.split("/");
    const file = parts[parts.length - 1] || img; // e.g. 'murukku.jpg'
    const base = file.split(".")[0];
    // try png first (our assets folder contains PNGs); fall back to jpg if needed
    try {
      return new URL(`../assets/${base}.png`, import.meta.url).href;
    } catch (e) {
      try {
        return new URL(`../assets/${base}.jpg`, import.meta.url).href;
      } catch (e2) {
        // last resort: return original path (may work if image is in public folder)
        return img;
      }
    }
  });

  useEffect(() => {
    if (resolvedImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % resolvedImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [resolvedImages.length]);
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 250;
    } else {
      cart.push({ ...product, quantity: 250, image: resolvedImages[0] });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div 
          className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img
            src={resolvedImages[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.popular && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          {resolvedImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {resolvedImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? "w-6 bg-white" 
                      : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
            <Badge variant="outline" className="mt-1">{product.category}</Badge>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              ₹{(product.pricePerGram * 250).toFixed(0)}
            </span>
            <span className="text-sm text-muted-foreground ml-1">/250g</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={addToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>

    <ProductDetailModal 
      product={product}
      isOpen={showModal}
      onClose={() => setShowModal(false)}
    />
  </>
  );
};

export default ProductCard;

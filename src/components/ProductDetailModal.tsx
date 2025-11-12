import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface ProductDetailModalProps {
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
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(250);

  // Resolve image paths to module URLs in `src/assets` (prefer PNG)
  const resolvedImages = product.images.map((img) => {
    const parts = img.split("/");
    const file = parts[parts.length - 1] || img;
    const base = file.split(".")[0];
    try {
      return new URL(`../assets/${base}.png`, import.meta.url).href;
    } catch (e) {
      try {
        return new URL(`../assets/${base}.jpg`, import.meta.url).href;
      } catch (e2) {
        return img;
      }
    }
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % resolvedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + resolvedImages.length) % resolvedImages.length);
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity, image: resolvedImages[0] });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Carousel */}
          <div className="relative">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={resolvedImages[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {resolvedImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-4">
                  {resolvedImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? "w-8 bg-primary" 
                          : "w-2 bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Thumbnail Images */}
            {resolvedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {resolvedImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? "border-primary" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{product.category}</Badge>
                {product.popular && (
                  <Badge className="bg-accent text-accent-foreground">Popular</Badge>
                )}
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 py-4 border-y">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">
                  ₹{(product.pricePerGram * quantity).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ₹{product.pricePerGram}/gram
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Quantity (grams)
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(100, quantity - 50))}
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(100, parseInt(e.target.value) || 100))}
                    className="w-24 text-center border rounded-md px-3 py-2"
                    min="100"
                    step="50"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 50)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={addToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            {product.inStock && (
              <p className="text-sm text-muted-foreground text-center">
                Fresh snacks delivered to your doorstep
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;

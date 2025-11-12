import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Shield, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import productsData from "@/data/products.json";
import heroImage from "@/assets/hero-snacks.png";

const Home = () => {
  const popularProducts = productsData.filter((p) => p.popular);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Traditional Tamil Nadu Snacks
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              Experience the authentic taste of homemade snacks, crafted with love and tradition
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="text-lg">
                  Shop Now <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh & Authentic</h3>
              <p className="text-muted-foreground">
                Made fresh daily with traditional recipes passed down through generations
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Ingredients</h3>
              <p className="text-muted-foreground">
                Only the finest ingredients, no preservatives or artificial flavors
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick and secure delivery right to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Popular Snacks</h2>
            <p className="text-xl text-muted-foreground">
              Customer favorites that keep them coming back for more
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/products">
              <Button size="lg" variant="default">
                View All Products <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h2 className="text-4xl font-bold mb-4">
            Ready to taste tradition?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Order now and get 10% off on your first purchase!
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="text-lg">
              Start Shopping <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

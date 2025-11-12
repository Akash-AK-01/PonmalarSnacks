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
      <section className="relative h-[400px] md:h-[600px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              Traditional Tamil Nadu Snacks
            </h1>
            <p className="text-base md:text-xl mb-6 md:mb-8 opacity-95">
              Experience the authentic taste of homemade snacks
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products">
                <Button size="default" variant="secondary" className="w-full sm:w-auto">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="default" variant="outline" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                <Package className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-base md:text-xl font-semibold mb-2">Fresh & Authentic</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Made fresh daily with traditional recipes
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-3 md:mb-4">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
              </div>
              <h3 className="text-base md:text-xl font-semibold mb-2">Quality Ingredients</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Only the finest ingredients, no preservatives
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mb-3 md:mb-4">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-accent" />
              </div>
              <h3 className="text-base md:text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Quick delivery right to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">Popular Snacks</h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              Customer favorites
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/products">
              <Button size="default" variant="default" className="w-full sm:w-auto">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            Ready to taste tradition?
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 opacity-95">
            Order now and get 10% off on your first purchase!
          </p>
          <Link to="/products">
            <Button size="default" variant="secondary" className="w-full sm:w-auto">
              Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

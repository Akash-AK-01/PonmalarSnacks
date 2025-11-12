import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-xl text-muted-foreground">
              Three generations of traditional snack-making excellence
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-lg leading-relaxed mb-6">
              Welcome to Ponmalar Snacks, where tradition meets taste! For over three decades, 
              we've been crafting authentic Tamil Nadu snacks using age-old recipes passed down 
              through generations. What started as a small family kitchen in Coimbatore has grown 
              into a beloved brand, bringing the authentic flavors of South India to homes across the country.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Our name "Ponmalar" (பொன்மலர்) means "golden flower" in Tamil, symbolizing the precious 
              and delicate nature of our traditional recipes. Every snack we make is a testament to our 
              commitment to quality, authenticity, and the rich culinary heritage of Tamil Nadu.
            </p>
            
            <p className="text-lg leading-relaxed">
              We source only the finest ingredients – rice from local farms, urad dal from the best suppliers, 
              and pure jaggery for our sweets. No preservatives, no artificial flavors – just pure, 
              traditional goodness in every bite.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Made with Love</h3>
              <p className="text-muted-foreground">
                Each batch is prepared with care and attention, just like home
              </p>
            </div>

            <div className="text-center p-8 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Family Recipes</h3>
              <p className="text-muted-foreground">
                Traditional recipes preserved and perfected over 30+ years
              </p>
            </div>

            <div className="text-center p-8 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality First</h3>
              <p className="text-muted-foreground">
                Only premium ingredients, no compromises on quality
              </p>
            </div>
          </div>

          <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              வணக்கம்! Welcome to our family
            </h2>
            <p className="text-lg opacity-95">
              Thank you for choosing Ponmalar Snacks. We're honored to bring 
              a taste of tradition to your home.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;

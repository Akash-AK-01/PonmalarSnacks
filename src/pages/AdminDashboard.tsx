import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, Edit, Trash2, Package, ShoppingCart, DollarSign } from "lucide-react";
import { toast } from "sonner";
import productsData from "@/data/products.json";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(productsData);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerGram: "",
    category: "Savory",
    images: [] as string[],
  });
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminAuth");
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, pricePerGram: parseFloat(formData.pricePerGram) }
          : p
      );
      setProducts(updatedProducts);
      toast.success("Product updated successfully!");
    } else {
      // Add new product
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        pricePerGram: parseFloat(formData.pricePerGram),
        inStock: true,
        popular: false,
      };
      setProducts([...products, newProduct]);
      toast.success("Product added successfully!");
    }
    
    resetForm();
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData({...formData, images: [...formData.images, imageInput.trim()]});
      setImageInput("");
      toast.success("Image added!");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData, 
      images: formData.images.filter((_, i) => i !== index)
    });
    toast.success("Image removed!");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pricePerGram: "",
      category: "Savory",
      images: [],
    });
    setImageInput("");
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      pricePerGram: product.pricePerGram.toString(),
      category: product.category,
      images: product.images || [product.image],
    });
    setShowAddProduct(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted successfully!");
  };

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-primary" },
    { label: "Total Orders", value: "23", icon: ShoppingCart, color: "text-secondary" },
    { label: "Revenue", value: "₹12,450", icon: DollarSign, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                View Store
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowAddProduct(!showAddProduct)}
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            {showAddProduct ? "Cancel" : "Add New Product"}
          </Button>
        </div>

        {/* Add/Edit Product Form */}
        {showAddProduct && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricePerGram">Price per Gram (₹)</Label>
                    <Input
                      id="pricePerGram"
                      type="number"
                      step="0.01"
                      value={formData.pricePerGram}
                      onChange={(e) => setFormData({...formData, pricePerGram: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full p-2 border rounded-md"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="Savory">Savory</option>
                      <option value="Sweet">Sweet</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="flex gap-2">
                      <Input
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        placeholder="/assets/product-image.jpg"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImage();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddImage}>
                        Add
                      </Button>
                    </div>
                    
                    {/* Image Preview */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Product ${index + 1}`}
                              className="w-full aspect-square object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {formData.images.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Add at least one image for the product
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  {editingProduct && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex gap-2">
                    {((product as any).images || [(product as any).image]).slice(0, 3).map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{product.category}</Badge>
                      <span className="text-sm font-medium">₹{product.pricePerGram}/g</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

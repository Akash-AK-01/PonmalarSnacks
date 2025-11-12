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
    price: "",
    priceUnit: "per-gram" as "per-gram" | "per-piece" | "per-100g" | "per-250g" | "per-500g" | "per-kg",
    category: "Savory",
    images: [] as string[],
  });
  const [imageInput, setImageInput] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");

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
    
    // Calculate pricePerGram based on selected unit
    let calculatedPricePerGram: number;
    const priceValue = parseFloat(formData.price);
    
    switch (formData.priceUnit) {
      case "per-piece":
        // For per-piece pricing, we'll use the price as-is and store unit info
        calculatedPricePerGram = priceValue; // Will be displayed differently
        break;
      case "per-100g":
        calculatedPricePerGram = priceValue / 100;
        break;
      case "per-250g":
        calculatedPricePerGram = priceValue / 250;
        break;
      case "per-500g":
        calculatedPricePerGram = priceValue / 500;
        break;
      case "per-kg":
        calculatedPricePerGram = priceValue / 1000;
        break;
      case "per-gram":
      default:
        calculatedPricePerGram = priceValue;
        break;
    }
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...p, 
              ...formData, 
              pricePerGram: calculatedPricePerGram,
              priceUnit: formData.priceUnit,
              originalPrice: priceValue,
            }
          : p
      );
      setProducts(updatedProducts);
      toast.success("Product updated successfully!");
    } else {
      // Add new product
      const newProduct = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        images: formData.images,
        pricePerGram: calculatedPricePerGram,
        priceUnit: formData.priceUnit,
        originalPrice: priceValue,
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageData]
        }));
        toast.success(`${file.name} added!`);
      };
      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
      };
      reader.readAsDataURL(file);
    });

    // Reset the file input
    e.target.value = '';
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
      price: "",
      priceUnit: "per-gram",
      category: "Savory",
      images: [],
    });
    setImageInput("");
    setUploadMethod("file");
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      pricePerGram: product.pricePerGram.toString(),
      price: (product.originalPrice || product.pricePerGram).toString(),
      priceUnit: product.priceUnit || "per-gram",
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
                    <Label htmlFor="priceUnit">Pricing Unit</Label>
                    <select
                      id="priceUnit"
                      className="w-full p-2 border rounded-md"
                      value={formData.priceUnit}
                      onChange={(e) => setFormData({...formData, priceUnit: e.target.value as any})}
                    >
                      <option value="per-piece">Per Piece</option>
                      <option value="per-gram">Per Gram</option>
                      <option value="per-100g">Per 100 Grams</option>
                      <option value="per-250g">Per 250 Grams</option>
                      <option value="per-500g">Per 500 Grams</option>
                      <option value="per-kg">Per Kilogram</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (₹)
                      {formData.priceUnit === "per-piece" && " - Per Piece"}
                      {formData.priceUnit === "per-gram" && " - Per Gram"}
                      {formData.priceUnit === "per-100g" && " - For 100g"}
                      {formData.priceUnit === "per-250g" && " - For 250g"}
                      {formData.priceUnit === "per-500g" && " - For 500g"}
                      {formData.priceUnit === "per-kg" && " - Per Kg"}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Enter price"
                      required
                    />
                    {formData.price && formData.priceUnit !== "per-gram" && formData.priceUnit !== "per-piece" && (
                      <p className="text-sm text-muted-foreground">
                        ≈ ₹{(parseFloat(formData.price) / 
                          (formData.priceUnit === "per-100g" ? 100 : 
                           formData.priceUnit === "per-250g" ? 250 : 
                           formData.priceUnit === "per-500g" ? 500 : 
                           formData.priceUnit === "per-kg" ? 1000 : 1)).toFixed(2)} per gram
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Images</Label>
                    
                    {/* Upload Method Toggle */}
                    <div className="flex gap-2 mb-2">
                      <Button
                        type="button"
                        variant={uploadMethod === "file" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUploadMethod("file")}
                      >
                        Upload File
                      </Button>
                      <Button
                        type="button"
                        variant={uploadMethod === "url" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUploadMethod("url")}
                      >
                        Add URL
                      </Button>
                    </div>

                    {/* File Upload */}
                    {uploadMethod === "file" && (
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="cursor-pointer"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Select one or more images to upload
                        </p>
                      </div>
                    )}

                    {/* URL Input */}
                    {uploadMethod === "url" && (
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
                    )}
                    
                    {/* Image Preview */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Product ${index + 1}`}
                              className="w-full aspect-square object-cover rounded-lg border"
                              onError={(e) => {
                                // Fallback for broken images
                                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
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
              {products.map((product) => {
                // Resolve image paths to module URLs
                const productImages = ((product as any).images || [(product as any).image]).slice(0, 3).map((img: string) => {
                  // If already a data URL or full URL, use as-is
                  if (img.startsWith('data:') || img.startsWith('http')) {
                    return img;
                  }
                  // Otherwise resolve from src/assets
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

                return (
                <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex gap-2">
                    {productImages.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{product.category}</Badge>
                      <span className="text-sm font-medium">
                        {(product as any).priceUnit === "per-piece" 
                          ? `₹${(product as any).originalPrice || product.pricePerGram}/piece`
                          : (product as any).priceUnit === "per-100g"
                          ? `₹${((product as any).originalPrice || (product.pricePerGram * 100).toFixed(0))}/100g`
                          : (product as any).priceUnit === "per-250g"
                          ? `₹${((product as any).originalPrice || (product.pricePerGram * 250).toFixed(0))}/250g`
                          : (product as any).priceUnit === "per-500g"
                          ? `₹${((product as any).originalPrice || (product.pricePerGram * 500).toFixed(0))}/500g`
                          : (product as any).priceUnit === "per-kg"
                          ? `₹${((product as any).originalPrice || (product.pricePerGram * 1000).toFixed(0))}/kg`
                          : `₹${product.pricePerGram}/g`
                        }
                      </span>
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
              );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

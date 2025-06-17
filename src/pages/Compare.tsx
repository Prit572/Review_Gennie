
import React, { useState } from 'react';
import { Star, Plus, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const Compare = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop",
      overallRating: 4.3,
      price: "$999",
      features: {
        camera: { rating: 4.7, sentiment: "positive" },
        battery: { rating: 3.8, sentiment: "neutral" },
        performance: { rating: 4.8, sentiment: "positive" },
        design: { rating: 4.5, sentiment: "positive" },
        value: { rating: 3.2, sentiment: "negative" }
      }
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop",
      overallRating: 4.5,
      price: "$1,199",
      features: {
        camera: { rating: 4.9, sentiment: "positive" },
        battery: { rating: 4.3, sentiment: "positive" },
        performance: { rating: 4.6, sentiment: "positive" },
        design: { rating: 4.2, sentiment: "positive" },
        value: { rating: 3.8, sentiment: "neutral" }
      }
    }
  ]);

  const [newProductSearch, setNewProductSearch] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  const removeProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addProduct = () => {
    if (newProductSearch.trim()) {
      const newProduct = {
        id: Date.now(),
        name: newProductSearch,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop",
        overallRating: 4.0,
        price: "$899",
        features: {
          camera: { rating: 4.2, sentiment: "positive" },
          battery: { rating: 4.0, sentiment: "positive" },
          performance: { rating: 4.3, sentiment: "positive" },
          design: { rating: 4.1, sentiment: "positive" },
          value: { rating: 4.2, sentiment: "positive" }
        }
      };
      setProducts([...products, newProduct]);
      setNewProductSearch('');
      setShowAddProduct(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const featureNames = {
    camera: "Camera",
    battery: "Battery",
    performance: "Performance", 
    design: "Design",
    value: "Value"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Comparison</h1>
          <p className="text-gray-600">Compare products side-by-side to make the best decision</p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 w-40">
                    Feature
                  </th>
                  {products.map((product) => (
                    <th key={product.id} className="px-6 py-4 text-center min-w-64">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-100 hover:bg-red-200"
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </Button>
                        
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg mx-auto mb-3"
                        />
                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <div className="flex items-center justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.overallRating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm font-semibold">
                            {product.overallRating}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-blue-600">{product.price}</p>
                      </div>
                    </th>
                  ))}
                  
                  {/* Add Product Column */}
                  <th className="px-6 py-4 text-center min-w-64">
                    {showAddProduct ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Search product..."
                          value={newProductSearch}
                          onChange={(e) => setNewProductSearch(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addProduct()}
                          className="text-sm"
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={addProduct}>Add</Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setShowAddProduct(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowAddProduct(true)}
                        className="w-full h-32 border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      >
                        <div className="text-center">
                          <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <span className="text-sm text-gray-600">Add Product</span>
                        </div>
                      </Button>
                    )}
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {Object.entries(featureNames).map(([key, name]) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {name}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-semibold">
                              {product.features[key as keyof typeof product.features].rating}
                            </span>
                          </div>
                          <Badge className={getSentimentColor(product.features[key as keyof typeof product.features].sentiment)}>
                            {product.features[key as keyof typeof product.features].sentiment}
                          </Badge>
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {products.length > 1 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Best Overall</h4>
                  <p className="text-sm text-gray-600">
                    {products.reduce((best, current) => 
                      current.overallRating > best.overallRating ? current : best
                    ).name} leads with the highest overall rating.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Best Value</h4>
                  <p className="text-sm text-gray-600">
                    Based on features and price, {products[0].name} offers the best value proposition.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-purple-700 mb-2">Key Differences</h4>
                  <p className="text-sm text-gray-600">
                    Camera quality varies significantly between products, with some excelling in low-light performance while others focus on zoom capabilities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Compare;

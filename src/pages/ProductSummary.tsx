
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, ThumbsUp, ThumbsDown, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';

const ProductSummary = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  // Mock data - in real app this would come from API
  const mockData = {
    product: {
      name: query || "iPhone 15 Pro",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop",
      overallRating: 4.2,
      totalReviews: 8,
      price: "$999"
    },
    features: [
      {
        name: "Performance",
        rating: 4.8,
        sentiment: "positive",
        pros: ["Blazing fast A17 Pro chip", "Excellent gaming performance", "Smooth multitasking"],
        cons: ["Can get warm during intensive tasks"],
        quotes: [
          { text: "The performance improvements are immediately noticeable", reviewer: "MKBHD" }
        ]
      },
      {
        name: "Display",
        rating: 4.4,
        sentiment: "positive",
        pros: ["Bright OLED display", "True color reproduction", "Always-on display"],
        cons: ["Bezels could be thinner", "No 120Hz on base model"],
        quotes: [
          { text: "The display quality is top-notch", reviewer: "Dave2D" }
        ]
      },
      {
        name: "Value",
        rating: 3.5,
        sentiment: "neutral",
        pros: ["Premium build quality", "Long software support"],
        cons: ["Very expensive", "Incremental upgrade from 14 Pro"],
        quotes: [
          { text: "Hard to justify the price for existing Pro users", reviewer: "Unbox Therapy" }
        ]
      }
    ],
    videos: [
      { title: `${query} Full Review`, channel: "MKBHD", duration: "12:34", thumbnail: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=150&h=100&fit=crop" },
      { title: `${query} Real World Test`, channel: "Dave2D", duration: "8:21", thumbnail: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=150&h=100&fit=crop" }
    ]
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-start space-x-6">
            <img
              src={mockData.product.image}
              alt={mockData.product.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mockData.product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(mockData.product.overallRating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold">
                    {mockData.product.overallRating}/5
                  </span>
                </div>
                <span className="text-gray-600">
                  Based on {mockData.product.totalReviews} video reviews
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {mockData.product.price}
                </span>
              </div>

              <div className="flex space-x-3">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/compare')}
                >
                  Add to Compare
                </Button>
                <Button variant="outline">
                  Share Summary
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Analysis</h2>
              
              <div className="space-y-6">
                {mockData.features.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{feature.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSentimentColor(feature.sentiment)}>
                            {feature.sentiment}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-semibold">{feature.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Pros
                          </h4>
                          <ul className="space-y-1">
                            {feature.pros.map((pro, i) => (
                              <li key={i} className="text-sm text-gray-600">• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Cons
                          </h4>
                          <ul className="space-y-1">
                            {feature.cons.map((con, i) => (
                              <li key={i} className="text-sm text-gray-600">• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Key Quotes</h4>
                        {feature.quotes.map((quote, i) => (
                          <blockquote key={i} className="border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 rounded-r">
                            <p className="text-sm italic text-gray-700">"{quote.text}"</p>
                            <cite className="text-xs text-gray-500">— {quote.reviewer}</cite>
                          </blockquote>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Source Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.videos.map((video, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-12 h-8 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-600">{video.channel}</p>
                        <p className="text-xs text-gray-500">{video.duration}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;

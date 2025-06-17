
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ThumbsUp, ThumbsDown, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';

const SampleSummary = () => {
  const navigate = useNavigate();

  const sampleData = {
    product: {
      name: "iPhone 15 Pro",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop",
      overallRating: 4.3,
      totalReviews: 12,
      price: "$999"
    },
    features: [
      {
        name: "Camera Quality",
        rating: 4.7,
        sentiment: "positive",
        pros: ["Excellent low-light performance", "Natural color reproduction", "Pro camera controls"],
        cons: ["Portrait mode can be inconsistent"],
        quotes: [
          { text: "The camera is absolutely stunning in low light", reviewer: "MKBHD" },
          { text: "Best iPhone camera we've seen", reviewer: "Unbox Therapy" }
        ]
      },
      {
        name: "Battery Life", 
        rating: 3.8,
        sentiment: "neutral",
        pros: ["All-day battery for most users", "Fast wireless charging"],
        cons: ["Not as good as Pro Max", "Drains quickly with intensive use"],
        quotes: [
          { text: "Battery life is decent but not groundbreaking", reviewer: "iJustine" }
        ]
      },
      {
        name: "Design & Build",
        rating: 4.5,
        sentiment: "positive", 
        pros: ["Premium titanium build", "Lighter than previous Pro models", "Action button is useful"],
        cons: ["Prone to fingerprints", "Sharp edges can be uncomfortable"],
        quotes: [
          { text: "The titanium feels incredibly premium", reviewer: "Dave2D" }
        ]
      }
    ],
    videos: [
      { title: "iPhone 15 Pro Review: The Good & Bad!", channel: "MKBHD", duration: "12:34", thumbnail: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=150&h=100&fit=crop" },
      { title: "iPhone 15 Pro vs iPhone 14 Pro!", channel: "Unbox Therapy", duration: "8:21", thumbnail: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=150&h=100&fit=crop" },
      { title: "Living with iPhone 15 Pro", channel: "iJustine", duration: "15:42", thumbnail: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=150&h=100&fit=crop" }
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
      
      {/* Demo Banner */}
      <div className="bg-blue-600 text-white py-3">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            📱 This is a demo summary - 
            <Button 
              variant="link" 
              className="text-white underline ml-1 p-0 h-auto"
              onClick={() => navigate('/')}
            >
              Try it with your product
            </Button>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-start space-x-6">
            <img
              src={sampleData.product.image}
              alt={sampleData.product.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {sampleData.product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(sampleData.product.overallRating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold">
                    {sampleData.product.overallRating}/5
                  </span>
                </div>
                <span className="text-gray-600">
                  Based on {sampleData.product.totalReviews} video reviews
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {sampleData.product.price}
                </span>
              </div>

              <div className="flex space-x-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
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
            {/* Feature Analysis */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Analysis</h2>
              
              <div className="space-y-6">
                {sampleData.features.map((feature, index) => (
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
            {/* Source Videos */}
            <Card>
              <CardHeader>
                <CardTitle>Source Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleData.videos.map((video, index) => (
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

            {/* CTA Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold mb-2">
                  Like what you see?
                </h3>
                <p className="text-blue-100 mb-4 text-sm">
                  Get instant summaries for any product you're researching
                </p>
                <Button 
                  className="bg-white text-blue-600 hover:bg-gray-100 w-full"
                  onClick={() => navigate('/')}
                >
                  Try Your Own Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleSummary;

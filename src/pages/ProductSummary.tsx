
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, ThumbsUp, ThumbsDown, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';

interface ProductData {
  id: string;
  name: string;
  image_url: string;
  overall_rating: number;
  total_reviews: number;
  description: string;
  summaries: Array<{
    summary_text: string;
    overall_sentiment: string;
    confidence_score: number;
    key_points: string[];
    pros_summary: string[];
    cons_summary: string[];
  }>;
  reviews: Array<{
    id: string;
    title: string;
    channel_name: string;
    video_url: string;
    rating: number;
    sentiment_score: number;
    pros: string[];
    cons: string[];
    published_at: string;
  }>;
}

const ProductSummary = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      fetchProductData(query);
    }
  }, [query]);

  const fetchProductData = async (productName: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching product data for:', productName);

      const { data, error } = await supabase.functions.invoke('analyze-product', {
        body: { productName }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.product) {
        setProductData(data.product);
      } else {
        throw new Error('No product data received');
      }
    } catch (err) {
      console.error('Error fetching product data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product data');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg text-gray-600">Analyzing product reviews...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Product</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchProductData(query)} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No product data found</p>
          </div>
        </div>
      </div>
    );
  }

  const summary = productData.summaries?.[0];
  const features = [
    {
      name: "Performance",
      rating: Math.min(5, Math.max(1, productData.overall_rating + 0.3)),
      sentiment: productData.overall_rating >= 4 ? 'positive' : productData.overall_rating >= 3 ? 'neutral' : 'negative',
      pros: summary?.pros_summary?.slice(0, 3) || ['Good performance'],
      cons: summary?.cons_summary?.slice(0, 2) || ['Could be better'],
      quotes: productData.reviews.slice(0, 1).map(review => ({
        text: `${review.title.slice(0, 60)}...`,
        reviewer: review.channel_name
      }))
    },
    {
      name: "Value",
      rating: Math.min(5, Math.max(1, productData.overall_rating - 0.2)),
      sentiment: productData.overall_rating >= 3.5 ? 'positive' : 'neutral',
      pros: ['Quality build', 'Long-term value'],
      cons: ['Premium pricing', 'Limited options'],
      quotes: productData.reviews.slice(1, 2).map(review => ({
        text: `${review.title.slice(0, 60)}...`,
        reviewer: review.channel_name
      }))
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-start space-x-6">
            <img
              src={productData.image_url}
              alt={productData.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productData.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(productData.overall_rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold">
                    {productData.overall_rating.toFixed(1)}/5
                  </span>
                </div>
                <span className="text-gray-600">
                  Based on {productData.total_reviews} video reviews
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
                {features.map((feature, index) => (
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
                            <span className="font-semibold">{feature.rating.toFixed(1)}/5</span>
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
                  {productData.reviews.slice(0, 5).map((review, index) => (
                    <a
                      key={index}
                      href={review.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">YT</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {review.title}
                        </h4>
                        <p className="text-xs text-gray-600">{review.channel_name}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-xs text-gray-500">{review.rating.toFixed(1)}/5</span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
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


import React from 'react';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    name: string;
    image: string;
    rating: number;
    totalReviews: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyInsights: string[];
    price?: string;
  };
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer p-6 border border-gray-100"
    >
      <div className="flex items-start space-x-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
          
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.totalReviews} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <Badge className={getSentimentColor(product.sentiment)}>
              {getSentimentIcon(product.sentiment)}
              <span className="ml-1 capitalize">{product.sentiment}</span>
            </Badge>
            {product.price && (
              <span className="text-lg font-bold text-gray-900">{product.price}</span>
            )}
          </div>

          <div className="space-y-1">
            {product.keyInsights.slice(0, 2).map((insight, index) => (
              <p key={index} className="text-sm text-gray-600">• {insight}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

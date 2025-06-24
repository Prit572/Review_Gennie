import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlayCircle, Star, Users, Zap } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

// Helper to extract YouTube video ID from a link
function extractYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (query: string) => {
    if (!user) {
      alert('Please sign in to analyze a product.');
      navigate('/auth');
      return;
    }
    // Always treat input as product name
    navigate(`/summary?q=${encodeURIComponent(query)}`);
  };

  const handleTryFree = () => {
    if (user) {
      // User is already signed in, show search functionality
      const searchElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      searchElement?.focus();
    } else {
      // User needs to sign up
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: "Instant Summaries",
      description: "Get comprehensive product insights in seconds"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Multiple Reviewers", 
      description: "Aggregate opinions from top tech reviewers"
    },
    {
      icon: <Star className="h-6 w-6 text-blue-600" />,
      title: "Smart Analysis",
      description: "AI-powered sentiment and feature breakdown"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Summarize the internet
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}before you buy
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Get instant, comprehensive summaries of YouTube product reviews. 
            Make smarter purchasing decisions with AI-powered insights.
          </p>

          <div className="mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              onClick={() => navigate('/sample')}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              See Sample Summary
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why ReviewGennie?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Trusted by smart shoppers everywhere
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="text-3xl font-bold text-gray-800">10K+</div>
            <div className="text-3xl font-bold text-gray-800">50K+</div>
            <div className="text-3xl font-bold text-gray-800">1M+</div>
            <div className="text-3xl font-bold text-gray-800">24/7</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600 mt-2">
            <div>Products Analyzed</div>
            <div>Reviews Processed</div>
            <div>Minutes Saved</div>
            <div>Support</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

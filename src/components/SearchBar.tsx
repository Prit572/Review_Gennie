
import React, { useState } from 'react';
import { Search, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showExamples?: boolean;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search product or paste YouTube links",
  showExamples = true 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  
  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const exampleSearches = [
    "iPhone 15 Pro",
    "MacBook Air M3",
    "Sony WH-1000XM5",
    "Tesla Model 3"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-14 pl-12 pr-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-200"
          />
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <Button
            onClick={handleSearch}
            className="absolute right-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
          >
            Search
          </Button>
        </div>
      </div>
      
      {showExamples && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleSearches.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

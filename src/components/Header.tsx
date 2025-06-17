
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Youtube, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Youtube className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ReviewSummarizer</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/sample"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/sample') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sample Summary
            </Link>
            <Link
              to="/compare"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/compare') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Compare
            </Link>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Try Free
            </Button>
          </nav>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

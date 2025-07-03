import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Youtube, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFullName = async () => {
      if (user) {
        // Fetch from users table
        const { data, error } = await import('@/integrations/supabase/client').then(({ supabase }) =>
          supabase.from('users').select('full_name').eq('id', user.id).single()
        );
        if (data && data.full_name) setFullName(data.full_name);
        else setFullName(null);
      } else {
        setFullName(null);
      }
    };
    fetchFullName();
  }, [user]);

  // Close menu on outside click or ESC
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Youtube className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">ReviewGennie</span>
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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{fullName || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/auth')}
                >
                  Try Free
                </Button>
              </>
            )}
          </nav>

          <Button variant="ghost" size="sm" className="md:hidden ml-auto" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <Fragment>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
          <div ref={mobileMenuRef} className="fixed top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-lg z-50 animate-slide-in flex flex-col">
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <span className="text-2xl">&times;</span>
              </Button>
            </div>
            {/* User info for mobile */}
            {user && (
              <div className="flex items-center space-x-2 px-6 pb-2">
                <User className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-base text-gray-900 truncate">{fullName || user.email}</span>
              </div>
            )}
            <nav className="flex flex-col space-y-2 px-6 py-2">
              <Link to="/" className={`text-base font-medium ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`} onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/sample" className={`text-base font-medium ${isActive('/sample') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`} onClick={() => setMobileMenuOpen(false)}>Sample Summary</Link>
              <Link to="/compare" className={`text-base font-medium ${isActive('/compare') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`} onClick={() => setMobileMenuOpen(false)}>Compare</Link>
              {user ? (
                <Button variant="outline" size="sm" className="mt-2" onClick={async () => { await handleSignOut(); setMobileMenuOpen(false); }}>Sign Out</Button>
              ) : (
                <Fragment>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>Sign In</Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 mt-2" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>Try Free</Button>
                </Fragment>
              )}
            </nav>
          </div>
        </Fragment>
      )}
    </header>
  );
};

export default Header;

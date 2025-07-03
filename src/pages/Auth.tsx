import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Chrome } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp, signIn, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        console.log('Attempting sign up for:', email);
        const { error } = await signUp(email, password, fullName);
        
        if (error) {
          console.error('Sign up error:', error);
          
          // Handle specific error cases
          if (error.message?.includes('User already registered')) {
            toast({
              title: "Account already exists",
              description: "This email is already registered. Try signing in instead.",
              variant: "destructive"
            });
            setIsSignUp(false);
          } else {
            toast({
              title: "Sign up failed",
              description: error.message || "Failed to create account",
              variant: "destructive"
            });
          }
        } else {
          console.log('Sign up successful');
          setSignUpSuccess(true);
          toast({
            title: "Account created successfully!",
            description: "Please check your email and click the verification link to complete your registration.",
          });
          
          // Clear form
          setEmail('');
          setPassword('');
          setFullName('');
        }
      } else {
        console.log('Attempting sign in for:', email);
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Sign in error:', error);
          
          if (error.message?.includes('Invalid login credentials')) {
            toast({
              title: "Invalid credentials",
              description: "Please check your email and password and try again.",
              variant: "destructive"
            });
          } else if (error.message?.includes('Email not confirmed')) {
            toast({
              title: "Email not verified",
              description: "Please check your email and click the verification link before signing in.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Sign in failed",
              description: error.message || "Failed to sign in",
              variant: "destructive"
            });
          }
        } else {
          console.log('Sign in successful');
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <Button 
                type="button"
                variant="outline" 
                className="w-full flex items-center justify-center space-x-2"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Chrome className="h-4 w-4" />
                <span>Continue with Google</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {signUpSuccess ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Check Your Email!
                  </h3>
                  <p className="text-green-700 text-sm">
                    We've sent a verification link to your email address. 
                    Please click the link to verify your account before signing in.
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    setSignUpSuccess(false);
                    setIsSignUp(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={isSignUp}
                      placeholder="Enter your full name"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    minLength={6}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </Button>
              </form>
            )}
            
            {!signUpSuccess && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"
                  }
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

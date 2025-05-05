
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ButtonWithIcon from '@/components/ui/button-with-icon';
import { ArrowLeft, Check } from 'lucide-react';

type AuthType = 'login' | 'register';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authType, setAuthType] = useState<AuthType>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('farmer');
  const [isLoading, setIsLoading] = useState(false);
  
  // Parse the authentication type from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type') as AuthType;
    if (type === 'login' || type === 'register') {
      setAuthType(type);
    }
  }, [location.search]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      
      if (authType === 'login') {
        toast({
          title: "Login successful!",
          description: "Redirecting to your dashboard...",
        });
      } else {
        toast({
          title: "Registration successful!",
          description: "Your account has been created. Welcome to Marketash!",
        });
      }
      
      // Redirect to dashboard after successful auth
      navigate('/dashboard');
    }, 1500);
  };
  
  const toggleAuthType = () => {
    const newType = authType === 'login' ? 'register' : 'login';
    setAuthType(newType);
    navigate(`/auth?type=${newType}`);
  };
  
  return (
    <div className="min-h-screen bg-marketash-gray flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/8daf162f-f92f-4d6c-951c-64e1b6d816a0.png" 
              alt="Marketash Logo" 
              className="h-10"
            />
          </Link>
          <Link to="/" className="text-gray-600 hover:text-marketash-blue transition-colors">
            <ArrowLeft className="h-5 w-5 inline mr-1" /> 
            Back to Home
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl w-full">
          {/* Left Side: Form */}
          <div className="p-8 md:p-12">
            <h1 className="text-3xl font-bold text-marketash-blue mb-6">
              {authType === 'login' ? 'Welcome Back!' : 'Create Your Account'}
            </h1>
            <p className="text-gray-600 mb-8">
              {authType === 'login' 
                ? 'Log in to access your Marketash dashboard and manage your farming business.' 
                : 'Join Marketash to connect with buyers, access AI tools, and grow your business.'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {authType === 'register' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-marketash-blue"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-marketash-blue"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-marketash-blue"
                  placeholder={authType === 'login' ? 'Enter your password' : 'Create a password'}
                  required
                />
              </div>
              
              {authType === 'register' && (
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('farmer')}
                      className={`px-4 py-3 rounded-md border ${
                        role === 'farmer'
                          ? 'border-marketash-green bg-marketash-lightGreen text-marketash-green font-medium'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {role === 'farmer' && (
                        <Check className="h-4 w-4 inline mr-1" />
                      )}
                      Farmer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`px-4 py-3 rounded-md border ${
                        role === 'buyer'
                          ? 'border-marketash-blue bg-marketash-lightBlue text-marketash-blue font-medium'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {role === 'buyer' && (
                        <Check className="h-4 w-4 inline mr-1" />
                      )}
                      Buyer
                    </button>
                  </div>
                </div>
              )}
              
              {authType === 'login' && (
                <div className="text-right">
                  <Link to="#" className="text-sm text-marketash-blue hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}
              
              <ButtonWithIcon
                variant="primary"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    {authType === 'login' ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  authType === 'login' ? 'Log In' : 'Create Account'
                )}
              </ButtonWithIcon>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {authType === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={toggleAuthType}
                    className="text-marketash-blue hover:underline"
                  >
                    {authType === 'login' ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>
            </form>
          </div>
          
          {/* Right Side: Image and Info */}
          <div className="relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1493962853295-0fd70327578a?q=80&w=800&auto=format&fit=crop"
              alt="African farming"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-marketash-blue/90 to-marketash-blue/75 flex flex-col justify-center p-12 text-white">
              <h2 className="text-2xl font-bold mb-6">
                {authType === 'login' 
                  ? 'Access Your Marketash Account' 
                  : 'Join Our Growing Community'}
              </h2>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>
                    {authType === 'login' 
                      ? 'View your current listings and bids' 
                      : 'List your produce and receive fair market prices'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>
                    {authType === 'login' 
                      ? 'Monitor your sales and revenue analytics' 
                      : 'Access AI tools to diagnose crop diseases'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>
                    {authType === 'login' 
                      ? 'Contact buyers and manage logistics' 
                      : 'Apply for microloans to grow your business'}
                  </span>
                </li>
              </ul>
              
              <div className="mt-8 p-4 bg-white/10 rounded-lg">
                <p className="italic text-white/90 text-sm">
                  "Marketash has transformed how I sell my produce. My income has increased by 30% since joining!"
                </p>
                <div className="mt-2 flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&auto=format&fit=crop"
                    alt="Happy Farmer" 
                    className="h-8 w-8 rounded-full object-cover border-2 border-white/50"
                  />
                  <span className="ml-2 text-sm">Sarah M., Tomato Farmer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;

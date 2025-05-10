
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signIn, signUp, loading, supabase } = useSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"farmer" | "buyer">("buyer");
  const [authError, setAuthError] = useState<string | null>(null);
  const [defaultTab, setDefaultTab] = useState<"login" | "register">("login");
  const [verificationSent, setVerificationSent] = useState(false);
  
  // Check for URL parameters that might indicate a specific flow
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('action') && params.get('action') === 'signup') {
      setDefaultTab('register');
    }
    
    // Handle email confirmation link
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=signup')) {
        try {
          toast({
            title: "Processing confirmation...",
            description: "Please wait while we verify your email.",
          });

          // The Supabase client should automatically handle the token
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            throw error;
          }
          
          if (data?.user) {
            toast({
              title: "Email verified!",
              description: "Your account has been verified. You can now log in.",
            });
            setDefaultTab('login');
          }
        } catch (error: any) {
          console.error("Error confirming email:", error);
          toast({
            variant: "destructive",
            title: "Verification failed",
            description: error.message,
          });
        }
      }
    };
    
    handleEmailConfirmation();
  }, [toast, supabase.auth, location]);
  
  // If user is already logged in, redirect to homepage
  useEffect(() => {
    if (user) {
      const returnTo = location.state?.from?.pathname || '/dashboard';
      navigate(returnTo);
    }
  }, [user, navigate, location]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    try {
      await signIn(email, password);
      // Successful login is handled by the supabase provider
    } catch (error: any) {
      setAuthError(error.message);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!name.trim()) {
      setAuthError("Please enter your name");
      return;
    }
    
    try {
      // Include user_type and name in metadata
      await signUp(email, password, {
        data: { 
          name,
          user_type: userType
        }
      });
      
      setVerificationSent(true);
      
      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      setAuthError(error.message);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-marketash-blue"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-marketash-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-marketash-blue">Marketash</h1>
          <p className="mt-2 text-gray-600">Join the agricultural marketplace revolution</p>
        </div>
        
        {verificationSent ? (
          <Card>
            <CardHeader>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                We've sent a verification link to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Please check your inbox at <strong>{email}</strong> and click on the
                verification link to complete your registration.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setVerificationSent(false)}
              >
                Back to Auth
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {authError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-marketash-blue hover:bg-marketash-blue/90"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Register</CardTitle>
                  <CardDescription>Create your account to start using Marketash</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Name</Label>
                      <Input 
                        id="register-name"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>I am a</Label>
                      <div className="flex space-x-2">
                        <Button 
                          type="button" 
                          variant={userType === "buyer" ? "default" : "outline"}
                          className={userType === "buyer" ? "bg-marketash-green" : ""}
                          onClick={() => setUserType("buyer")}
                        >
                          Buyer
                        </Button>
                        <Button 
                          type="button" 
                          variant={userType === "farmer" ? "default" : "outline"}
                          className={userType === "farmer" ? "bg-marketash-blue" : ""}
                          onClick={() => setUserType("farmer")}
                        >
                          Farmer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-marketash-green hover:bg-marketash-green/90"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        <div className="text-center mt-4">
          <Link to="/" className="text-marketash-blue hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
